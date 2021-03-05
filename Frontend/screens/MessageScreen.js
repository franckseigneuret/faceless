import HTTP_IP_DEV from '../mon_ip'
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SwitchSelector from "react-native-switch-selector";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const windowSize = Dimensions.get('window');
console.log('windowSize', windowSize)

function MessageScreen(props) {

  const [token, setToken] = useState(null)
  const [myId, setMyId] = useState(null)
  const [countFriends, setCountFriends] = useState(0)
  const [msgFriends, setMsgFriends] = useState([])
  const [unreadPerConversation, setUnreadPerConversation] = useState([])

  useEffect(() => {
    AsyncStorage.getItem("token", function (error, tokenValue) {
      setToken(tokenValue)
    })

    const getId = async () => {
      const idRaw = await fetch(HTTP_IP_DEV + '/get-id-from-token?token=' + token, { method: 'GET' })
      const idResponse = await idRaw.json()

      return idResponse.id
    }

    const getDialogues = async () => {
      const myConnectedId = await getId()
      console.log('myConnectedId = ', myConnectedId)
      setMyId(myConnectedId)
      const dialogues = await fetch(HTTP_IP_DEV + '/show-msg?user_id=' + myConnectedId, { method: 'GET' })

      const dialoguesWithFriends = await dialogues.json()
      console.log('dialoguesWithFriends.conversations = ', dialoguesWithFriends.conversations)
      setCountFriends(dialoguesWithFriends.conversations.length)
      setMsgFriends(dialoguesWithFriends.conversations)

      let nolu = []
      dialoguesWithFriends.conversations.forEach(element => {
        nolu.push(element.nbUnreadMsg)
      });
      setUnreadPerConversation(nolu)
    }
    getDialogues()

  }, [token])

  const items = msgFriends.map((el, i) => {

    if (el.lastMessage && el.friendsDatas) {
      console.log('el ', el.nbUnreadMsg)
      let when = new Date(el.lastMessage.date)
      let whenFormat = when.toLocaleDateString('fr-FR', { weekday: 'short', month: 'short', day: 'numeric' })
        + ' à ' + when.toLocaleTimeString('fr-FR')

      return <TouchableOpacity
        key={i}
        onPress={() => {
          let noluCopy = [...unreadPerConversation]
          noluCopy[i] = 0
          setUnreadPerConversation(noluCopy)
          props.navigation.navigate('ConversationScreen', {
            token,
            myId,
            myContactId: el.friendsDatas._id,
            convId: el.lastMessage.conversation_id,
          })
        }}>

        <View style={styles.conversations}>
          {
            unreadPerConversation[i] ?
              <View style={styles.nonLuContent}>
                <Text style={styles.nonLuText}>{unreadPerConversation[i]}</Text>
              </View>
              :
              <Text />
          }
          <View style={styles.lastMessage}>
            <Text style={styles.friend}>
              {el.friendsDatas.pseudo}
            </Text>
            <Text style={styles.date}>
              {whenFormat}
            </Text>
            <Text style={styles.msg} numberOfLines={4} ellipsizeMode='tail'>
              <Text style={styles.last}>Dernier message : </Text>{el.lastMessage.content}
            </Text>
          </View>
          <View>
            {
              el.friendsDatas.avatar && el.friendsDatas.avatar !== undefined && el.friendsDatas.avatar !== '' ?

                <Image style={styles.avatar} source={{ uri: el.friendsDatas.avatar }} />
                :
                <Text />
            }
          </View>
        </View>

      </TouchableOpacity>

    }

  })

  return (

    <View style={styles.container}>
      {
        countFriends > 0 ?
          <View style={styles.main}>
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
            <ScrollView showsVerticalScrollIndicator={true} style={styles.ScrollView}>
              {items}
            </ScrollView>
          </View>
          :
          <Text>
            Vous n'avez pas de confident !
            <Button title="Rechercher des confidents" />
          </Text>

      }
    </View>

  );
}

export default MessageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#ffeddb'
  },
  main: {
    // borderWidth: 1,
    // borderColor: "#CCC",
    height: windowSize.height * .9,
  },
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
    margin: 10,
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 115,
    width: windowSize.width * .9,
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
  nonLuContent: {
    backgroundColor: '#5571D7',
    position: 'absolute',
    right: -7,
    top: -7,
    borderRadius: 10,
    width: 20,
    height: 20,
    paddingLeft: 6,
    paddingTop: 2,
  },
  nonLuText: {
    color: 'white',
  },

  scrollView: {
    height: windowSize.height * .7,
  },
  lastMessage: {
    width: '70%',
  },
  avatar: {
    width: 75,
    height: 75,
    borderRadius: 75 / 2,
    borderWidth: 3,
    borderColor: "#EC9A1F",
  },
  friend: {
    color: '#5571D7',
    fontSize: 20,
    fontWeight: 'bold',
  },
  date: {
    marginBottom: 5,
    color: '#888',
    fontSize: 10,
  },
  msg: {
    fontSize: 12,
  },
  last: {
    color: '#888',
    fontStyle: 'italic'
  },
})