import HTTP_IP_DEV from '../mon_ip'
import React, { useEffect, useState } from 'react';
import { Text, View, Button } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MessageScreen(props) {

  const [countFriends, setCountFriends] = useState(0)
  const [msgFriends, setMsgFriends] = useState([])

  useEffect(() => {

    const getDialogues = async () => {
      const dialogues = await fetch(HTTP_IP_DEV + '/show-msg', { method: 'GET' })

      const dialoguesWithFriends = await dialogues.json()
      console.log('///',dialoguesWithFriends)
      setCountFriends(dialoguesWithFriends.result.length)
      setMsgFriends(dialoguesWithFriends.result)
    }
    getDialogues()

  }, [])

  const items = msgFriends.map((el, i) => {
    console.log('@', el)
    if (el.length > 0) {
      return <Text key={i}>
        - {el[0].content}
      </Text>
    }
  })

  return (

    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
      {
        countFriends > 0 ?
          <View>
            <Text>MESSAGES</Text>
            {items}
          </View>
          :
          <Text>
            Vous n'avez pas de confident
            <Button title="Rechercher des confidents" />
          </Text>

      }
    </View>

  );
}

export default MessageScreen;