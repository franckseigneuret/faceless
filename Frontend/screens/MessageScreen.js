import HTTP_IP_DEV from '../mon_ip'
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, Image, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SwitchSelector from "react-native-switch-selector";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MessageScreen(props) {

  const [countFriends, setCountFriends] = useState(0)
  const [msgFriends, setMsgFriends] = useState([])
  const [friends, setFriends] = useState([])

  // const myConnectedId = '603f67380ce5ea52ee401325'
  const myConnectedId = '603f618c78727809c7e1ad9a'



  useEffect(() => {
    const getDialogues = async () => {
      const dialogues = await fetch(HTTP_IP_DEV + '/show-msg?user_id=' + myConnectedId, { method: 'GET' })

      const dialoguesWithFriends = await dialogues.json()
      console.log('dialoguesWithFriends = ', dialoguesWithFriends)
      setCountFriends(dialoguesWithFriends.conversations.length)
      setMsgFriends(dialoguesWithFriends.conversations)
      // setFriends(dialoguesWithFriends.friendsData)
    }
    getDialogues()

  }, [])

  const items = msgFriends.map((el, i) => {

    if (el.lastMessage && el.friendsDatas) {
      let when = new Date(el.lastMessage.date)
      let whenFormat = when.toLocaleDateString('fr-FR', { weekday: 'short', month: 'short', day: 'numeric' })
        + ' à ' + when.toLocaleTimeString('fr-FR')

      return <TouchableOpacity
        onPress={() => props.navigation.navigate('ConversationScreen', {
          myId: myConnectedId,
          myContactId: el.friendsDatas._id,
        })}>
        <View key={i} style={styles.conversations}>
          <View style={styles.lastMessage}>
            <Text style={styles.friend}>
              {el.friendsDatas.pseudo}
            </Text>
            <Text style={styles.date}>
              {whenFormat}
            </Text>
            <Text style={styles.msg} numberOfLines={4} ellipsizeMode='tail'>
              {el.lastMessage.content}
            </Text>

          </View>
          <View style={styles.avatar}>
            {
              el.friendsDatas.avatar && el.friendsDatas.avatar !== undefined && el.friendsDatas.avatar !== '' ?

                <Image source={{ uri: el.friendsDatas.avatar }} style={{ width: 75, height: 75, margin: 7 }} />
                :
                <Text />
            }
          </View>
        </View>

      </TouchableOpacity>

    }

  })

  return (

    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffeddb' }}>
      {
        countFriends > 0 ?
          <View>
            <Text style={styles.mainTitle}>Messagerie</Text>
            <SwitchSelector style={styles.switch}
              initial={0}
              // onPress={value => this.setState({ gender: value })}
              textColor={'#5571D7'}
              selectedColor={'#FFF'}
              backgroundColor={'#b9c7f3'}
              buttonColor={'#5571D7'}
              borderColor={'#BCC8F0'}
              hasPadding
              fontSize={18}
              options={[
                { label: "Confidents", value: "c" },
                { label: "Demandes (0)", value: "d" },
              ]}
            />
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

const styles = StyleSheet.create({
  mainTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#5571D7',
    textAlign: 'center',
  },
  switch: {
    marginVertical: 40,
  },
  conversations: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 115,
    width: 340,
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff1e0',
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  lastMessage: {
  },
  avatar: {
  },
  friend: {
    color: '#5571D7',
    fontSize: 20,
  },
  date: {
    marginBottom: 5,
    color: '#AAA',
    fontSize: 10,
  },
  msg: {
    fontSize: 12,
  },
})