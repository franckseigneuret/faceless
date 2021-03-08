import HTTP_IP_DEV from '../mon_ip'
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, Image, TouchableOpacity, ScrollView, Dimensions, Vibration } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SwitchSelector from "react-native-switch-selector";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const windowSize = Dimensions.get('window');

function MessageScreen(props) {

  const [token, setToken] = useState(null)
  const [myId, setMyId] = useState(null)
  const [conversations, setConversations] = useState([])
  const [unreadPerConversation, setUnreadPerConversation] = useState([])

  const loadConversations = async (params) => {
    console.log('myId', myId)
    if (myId) { // l'id obtenue à partir du token existe bien
      let uri = `${HTTP_IP_DEV}/show-msg?user_id=${myId}`
      if(params.demandes) {
        uri += `&demandes=oui`
      }
      const dialogues = await fetch(uri, { method: 'GET' })

      const dialoguesWithFriends = await dialogues.json()
      // console.log('dialoguesWithFriends.conversations = ', dialoguesWithFriends.conversations)
      setConversations(dialoguesWithFriends.conversations)

      let nolu = []
      dialoguesWithFriends.conversations.forEach(element => {
        nolu.push(element.nbUnreadMsg)
      });
      setUnreadPerConversation(nolu)
    }

  }

  useEffect(() => {
    AsyncStorage.getItem("token", function (error, tokenValue) {
      setToken(tokenValue)
      const getId = () => {
        fetch(HTTP_IP_DEV + '/get-id-from-token?token=' + tokenValue, { method: 'GET' })
          .then(r => r.json())
          .then(data => {
            setMyId(data.id)
          }).catch((e) =>
            console.log('error', e)
          )
      }
      getId()
    })

    loadConversations({demandes:false})
    // setInterval(() => loadConversations(), 5000) // ne marche pas !!

  }, [myId])

  const items = conversations.map((el, i) => {

    if (el.lastMessage && el.friendsDatas) {
      let when = new Date(el.lastMessage.date)
      let whenFormat = when.toLocaleDateString('fr-FR', { weekday: 'short', month: 'short', day: 'numeric' })
        + ' à ' + when.toLocaleTimeString('fr-FR')

      return <TouchableOpacity
        activeOpacity={1}
        key={i}
        onPress={() => {
          let noluCopy = [...unreadPerConversation]
          noluCopy[i] = 0
          setUnreadPerConversation(noluCopy)
          console.log(el.friendsDatas,'<<<<----- props à renvoyer')
          props.navigation.navigate('ConversationScreen', {
            token,
            myId,
            myContactId: el.friendsDatas._id,
            convId: el.lastMessage.conversation_id,
            pseudo: el.friendsDatas.pseudo,
            gender: el.friendsDatas.gender,
            subscriptionDate: el.friendsDatas.subscriptionDate,
            problemDesc : el.friendsDatas.problem_description,
            problems_types : el.friendsDatas.problems_types,
            avatar: el.friendsDatas.avatar
          })
        }}>

        <View style={styles.conversationsItem}>
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
        conversations.length > 0 ?
          <View style={styles.main}>
            <Text style={styles.mainTitle}>Messagerie</Text>
            <SwitchSelector style={styles.switch}
              initial={0}
              onPress={value => {
                value === 'demandes' ? loadConversations({demandes:true}) : loadConversations({demandes:false})
              }}
              textColor={'#5571D7'}
              selectedColor={'#FFF'}
              backgroundColor={'#b9c7f3'}
              buttonColor={'#5571D7'}
              borderColor={'#BCC8F0'}
              hasPadding
              fontSize={18}
              options={[
                { label: "Confidents", value: 'confidents' },
                { label: "Demandes (0)", value: 'demandes' },
              ]}
            />
            <View style={styles.conversations}>
              <Image style={styles.loader} source={{ uri: 'https://i.imgur.com/WtX0jT0.gif' }} />
              <View style={styles.scrollContent}>
                <ScrollView
                  showsVerticalScrollIndicator={true} style={styles.ScrollView}
                  onMomentumScrollEnd={() => {
                    Vibration.vibrate(10);
                    loadConversations()
                  }}
                >
                  {items}
                </ScrollView>
              </View>
            </View>
          </View>
          :
          <View style={styles.ScrollView}>
            <Text style={{ textAlign: 'center' }}>
              Vous n'avez pas de confident !
            </Text>
            <Text>
              <Button title="Rechercher des confidents"
                onPress={() => props.navigation.navigate("HomeScreen")} />
            </Text>
          </View>
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
    position: 'relative',
    width: windowSize.width * .9,
  },
  loader: {
    marginHorizontal: '45%',
    height: 50,
    width: 50,
  },
  scrollContent: {
    position: 'absolute',
    top: -10,
    left: -10,
    height: windowSize.height * .7,
    width: '900%'
  },
  scrollView: {
    height: windowSize.height * .7,
  },
  conversationsItem: {
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