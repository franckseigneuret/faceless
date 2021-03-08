import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Image, Alert, Modal, Pressable, KeyboardAvoidingView, Button } from 'react-native';
import { Input } from 'react-native-elements';
import { useFonts, Montserrat_400Regular, Montserrat_700Bold, Montserrat_900Black, Montserrat_800ExtraBold } from "@expo-google-fonts/montserrat";
import { Ionicons } from '@expo/vector-icons';
import AppLoading from 'expo-app-loading';
import { useIsFocused } from "@react-navigation/native";
import { ScrollView } from 'react-native-gesture-handler';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HTTP_IP_DEV from '../mon_ip'


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


function HomeScreen(props) {
  const isFocused = useIsFocused();
  const [userToDisplay, setUserToDisplay] = useState([]);
  const [pseudo, setPseudo] = useState('');
  const [myToken, setMyToken] = useState('');
  const [myContactId, setMyContactId] = useState('');
  const [myId, setMyId] = useState(null)
  const [newConvId, setNewConvId] = useState('');
  const [currentMsg, setCurrentMsg] = useState("")

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    var token;
    var filter;
    const handleData = () => {
      AsyncStorage.multiGet(['token', 'filter'], async function (error, data) {

        let token = data[0][0];
        let tokenValue = data[0][1]
        let filter = data[1][0]
        let filterValue = JSON.parse(data[1][1])
        console.log(filterValue, '<-------- filter multiget')

        var rawResponse = await fetch(`${HTTP_IP_DEV}/show-card?tokenFront=${tokenValue}&filterFront=${JSON.stringify(filterValue)}`);
        var response = await rawResponse.json();
        setUserToDisplay(response.userToShow)
        setPseudo(response.user.pseudo)
        //recupere mon token
        setMyToken(response.user.token)


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
    };
    handleData()
    console.log('use effect on home')
  }, [isFocused]);

  AsyncStorage.getItem("filter", function (error, data) {
    // console.log(JSON.parse(data), '<<<<<-------- new filter')
  });

  // console.log("USER TO DISPLAY", userToDisplay)

  async function createConv(contactId) {
    console.log('myId', myId)
    console.log('contactId', contactId)
    var rawResponse = await fetch(`${HTTP_IP_DEV}/create-conv`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      //remplacer mon ID avec celui recuperer du back
      body: `myContactId=${contactId}&myId=${myId}`
    });
    var response = await rawResponse.json();
    console.log("create conv", response.convId)
    // setNewConvId(response.convId)
  }

  var sendMsg = async (myContactId, message) => {
    await fetch(`${HTTP_IP_DEV}/send-msg`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `msg=${message}&myContactId=${myContactId}`
    });
    setCurrentMsg("")
    setModalVisible(!modalVisible)
  }

  console.log("current msg", currentMsg)

  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
    Montserrat_900Black,
    Montserrat_800ExtraBold,

  });

  var noCard =
    <View style={styles.noCardContainer}>
      <Text style={styles.noCardText}>Aucun profil à afficher, étends ta recherche pour rencontrer de nouvelles personnes !</Text>
      <Button title='Étendre la recherche' style={styles.noCardButton} />
    </View>


  var CardToSwipe = userToDisplay.map((e, i) => {
    // console.log(e.problem_description,'<---- avatar')

    return (<Animatable.View key={i} animation="bounceInLeft" easing="ease-in-out" iterationCount={1} duration={800} direction="alternate" style={styles.cardContainer}>
      <View style={styles.topCard}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
        // onRequestClose={() => {
        //   Alert.alert("Modal has been closed.");
        //   setModalVisible(!modalVisible);
        // }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity style={styles.button} onPress={() => { setModalVisible(!modalVisible), console.log("newConvId", newConvId) }}>
                <Ionicons name="chevron-back" size={30} color="#5571D7" style={{ alignSelf: 'center', marginTop: 3 }} />
              </TouchableOpacity>
              <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ width: "80%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                <Input
                  containerStyle={{ marginBottom: 5, borderWidth: 2, minHeight: 40, maxHeight: 100, borderColor: "#8C8C8C", borderRadius: 20, backgroundColor: "white" }}
                  placeholder='Your message'
                  inputContainerStyle={{ borderBottomWidth: 0 }}
                  multiline={true}
                  value={currentMsg}
                  onChangeText={(val) => setCurrentMsg(val)}
                />
                <TouchableOpacity style={styles.buttonSend} onPress={() => sendMsg(myContactId, currentMsg)}>
                  <Ionicons name="send" size={25} color="#FFEEDD" style={styles.sendButton} />
                </TouchableOpacity>
              </KeyboardAvoidingView>
            </View>
          </View>
        </Modal>
        <Image source={{ uri: e.avatar }} style={{ borderWidth: 3, borderRadius: 50, borderColor: '#EC9A1F', width: 100, height: 100 }} />
        <Text style={styles.pseudo} numberOfLines={1}>{e.pseudo}</Text>
        <Text style={styles.member}>Membre depuis le 12 février 2020</Text>
        {/* <Text style={{marginTop: 5}}><Ionicons name='location' size={15} /> Region de {e.localisation.label == undefined ? 'France' : e.localisation.label}</Text> */}
      </View>
      <View style={styles.problemDesc}>
        <Text style={styles.subtitle}>En quelques mots :</Text>
        <Text style={{ color: "#264653", fontFamily: "Montserrat_400Regular", }} numberOfLines={4}>{e.problem_description}</Text>
      </View>
      <View style={styles.problemContainer}>
        <Text style={styles.subtitle}>Type(s) de probleme(s)</Text>
        <View style={styles.problemBadge}>
          {e.problems_types.map((arg, i) => {
            return (<View style={styles.badge} key={i}><Text style={styles.fontBadge}>{arg}</Text></View>)
          })}
        </View>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', padding: 20 }}>

          <TouchableOpacity
            style={styles.buttonSend}
            onPress={() => { setModalVisible(true), createConv(e._id), setMyContactId(e._id) }}
          ><Ionicons name="send" size={25} color="#FFEEDD" style={styles.sendButton} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('UserProfilScreen')}
            style={styles.buttonInfo}>
            <Text style={styles.textInfo}>i</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animatable.View>)
  });

  var handlePressFilter = () => {
    props.navigation.navigate('Filter')
  }

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    if (userToDisplay.length > 0) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFEEDD' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 40, marginBottom: 20, width: '65%', left: 30 }}>
            <Text style={styles.textTitle}>
              Salut {pseudo} !
          </Text>
            <TouchableOpacity style={styles.buttonDate} onPress={() => handlePressFilter()}>
              <Ionicons name="funnel" size={25} color="#5571D7" style={{ alignSelf: 'center', marginTop: 3 }} />
            </TouchableOpacity>
          </View>
          <ScrollView showsHorizontalScrollIndicator={false} snapToInterval={windowWidth} decelerationRate='fast' horizontal >
            {CardToSwipe}
          </ScrollView >

          {/* delete */}
          {/* <TouchableOpacity 
          style={styles.buttonSend}
          //renvoyer en argument de createConv l'ID de mon contact
          onPress={()=> createConv("603f618c78727809c7e1ad9a")}
        ><Ionicons name="send" size={25} color="#FFEEDD" style={styles.sendButton}/>
        </TouchableOpacity> */}
        </View>
      )
    } else {
      return (
        <View style={styles.noCardContainer}>
          <Text style={styles.textTitle}>
            Salut {pseudo} !
          </Text>
          <Text style={styles.noCardText}>Aucun profil à afficher, étends ta recherche pour rencontrer de nouvelles personnes !</Text>
          <TouchableOpacity style={styles.noCardButton} onPress={() => handlePressFilter()}>
            <Text style={styles.noCardButtonText}>Étendre la recherche</Text>
          </TouchableOpacity>
        </View>
      )
    }
  };
}

export default HomeScreen;

const styles = StyleSheet.create({
  buttonDate: {
    backgroundColor: "#FFEEDD",
    padding: 10,
    width: 50,
    height: 50,
    borderRadius: 30,
    borderColor: '#5571D7',
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5
  },
  textTitle: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontWeight: "900",
    fontSize: 26,
    lineHeight: 32,
    textAlign: 'center',
    color: '#5571D7',
  },
  cardContainer: {
    width: windowWidth - 40,
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: "#FFEEDD",
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 15,
    shadowColor: "black",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
  },
  topCard: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: windowHeight / 4.5,
    marginTop: 10
  },
  problemDesc: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%'
  },
  problemContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 10
  },
  problemBadge: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap'
  },
  buttonSend: {
    backgroundColor: "#5571D7",
    padding: 10,
    width: 50,
    height: 50,
    borderRadius: 30,
    borderColor: '#5571D7',
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonInfo: {
    backgroundColor: "#5571D7",
    width: 50,
    height: 50,
    borderRadius: 30,
    borderColor: '#5571D7',
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInfo: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 20,
    color: "#FFEEDD"
  },
  badge: {
    backgroundColor: '#5571D7',
    margin: 2,
    fontSize: 10,
    borderRadius: 30
  },
  fontBadge: {
    color: 'white',
    marginHorizontal: 15,
    marginVertical: 5,
    fontFamily: "Montserrat_700Bold",
  },
  pseudo: {
    textAlign: "center",
    fontSize: 20,
    color: "#5571D7",
    fontFamily: "Montserrat_700Bold",
  },
  member: {
    textAlign: "center",
    color: "#909090",
    fontFamily: "Montserrat_700Bold",
    fontStyle: 'italic',
    marginTop: 5
  },
  subtitle: {
    color: "#EC9A1F",
    fontSize: 16,
    fontFamily: "Montserrat_700Bold"
  },
  sendButton: {
    alignSelf: 'center',
    marginLeft: 3,
    marginBottom: 5,
    transform: [{ rotate: '-45deg' }]
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    width: "90%",
    minHeight: "30%",
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  buttonSend: {
    backgroundColor: "#5571D7",
    padding: 10,
    width: 50,
    height: 50,
    borderRadius: 30,
    borderColor: '#5571D7',
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10
  },
  sendButton: {
    alignSelf: 'center',
    marginLeft: 3,
    marginBottom: 5,
    transform: [{ rotate: '-45deg' }]
  },
  button: {
    backgroundColor: "#FFF1E2",
    width: 50,
    height: 50,
    borderRadius: 30,
    borderColor: '#5571D7',
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 15
  },

  noCardContainer: {
    width: '100%',
    height: windowHeight - 50,
    backgroundColor: "#FFEEDD",
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  noCardText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 22,
    color: '#EC9A1F',
    textAlign: 'left',
    width: '80%'
  },
  noCardButton: {
    backgroundColor: "#5571D7",
    borderRadius: 86,
    margin: 20,
    padding: 10
  },
  noCardButtonText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 22,
    color: '#FFEEDD',
    textAlign: 'center'
  }
})
