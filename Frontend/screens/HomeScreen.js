import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Image } from 'react-native';
import {useFonts, Montserrat_400Regular, Montserrat_700Bold, Montserrat_900Black, Montserrat_800ExtraBold} from "@expo-google-fonts/montserrat";
import { Ionicons } from '@expo/vector-icons';
import AppLoading from 'expo-app-loading';
import { ScrollView } from 'react-native-gesture-handler';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HTTP_IP_DEV from '../mon_ip'


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


function HomeScreen(props) {

  const [userToDisplay, setUserToDisplay] = useState([]);
  const [pseudo, setPseudo] = useState('');



  useEffect(() => {
    var token;
    var filter;
  const handleData = () => {
     AsyncStorage.multiGet(['token', 'filter'], async function (error, data){
       
          let token = data[0][0];
          let tokenValue = data[0][1]
          let filter = data[1][0]
          let filterValue = JSON.parse(data[1][1])

          var rawResponse = await fetch(`${HTTP_IP_DEV}/show-card?tokenFront=${tokenValue}&filterFront=${JSON.stringify(filterValue)}`);
          var response = await rawResponse.json();
          setUserToDisplay(response.userToShow)
          setPseudo(response.user.pseudo)
    

     })
  }; 
  handleData()
  }, []);

  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
    Montserrat_900Black,
    Montserrat_800ExtraBold,

  });

  var CardToSwipe = userToDisplay.map((e, i) => {
    // console.log(e.problem_description,'<---- avatar')
     
      return (<Animatable.View key={i} animation="bounceInLeft" easing="ease-in-out" iterationCount={1} duration={800} direction="alternate" style={styles.cardContainer}>
                <View style={styles.topCard}>
                  <Image source={{uri: e.avatar}} style={{borderWidth:3, borderRadius:50, borderColor:'#EC9A1F', width:100, height:100}}/>
                  <Text style={styles.pseudo} numberOfLines={1}>{e.pseudo}</Text>
                  <Text style={styles.member}>Membre depuis le 12 février 2020</Text>
                  {/* <Text style={{marginTop: 5}}><Ionicons name='location' size={15} /> Region de {e.localisation.label == undefined ? 'France' : e.localisation.label}</Text> */}
                </View>
                <View style={styles.problemDesc}>
                  <Text style={styles.subtitle}>En quelques mots :</Text>
                  <Text style={{ color: "#264653", fontFamily: "Montserrat_400Regular",}} numberOfLines={4}>{e.problem_description}</Text>
                </View>
                <View style={styles.problemContainer}>
                  <Text style={styles.subtitle}>Type de probleme(s)</Text>
                  <View style={styles.problemBadge}>
                    {e.problems_types.map((arg, i) => {
                      return ( <View style={styles.badge} key={i}><Text style={styles.fontBadge}>{arg}</Text></View>)
                    })}
                  </View>
                  <View style={{display:'flex',flexDirection:'row', justifyContent:'space-between', width:'100%', padding:20}}>

                  <TouchableOpacity 
                                style={styles.buttonSend}
                                onPress={() => props.navigation.navigate('ConversationScreen', {
                                  token,
                                  myId: myConnectedId,
                                  myContactId: e._id,
                                  convId: null,
                                })}
                              ><Ionicons name="send" size={25} color="#FFEEDD" style={styles.sendButton}/>
                  </TouchableOpacity>
                  </View>
                </View>
              </Animatable.View>)
});

  var handleSubmit = () => {
    props.navigation.navigate('Filter')
  }

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor:'#FFEEDD'}}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent:'space-between', marginTop: 40, marginBottom:20, width: '65%', left:30}}>
          <Text style={styles.textTitle}>
            Salut {pseudo} !
          </Text>
          <TouchableOpacity style={styles.buttonDate} onPress={() => handleSubmit()}>
            <Ionicons name="funnel" size={25} color="#5571D7" style={{alignSelf: 'center', marginTop: 3}}/>
          </TouchableOpacity>
        </View>
        <ScrollView showsHorizontalScrollIndicator={false} snapToInterval={windowWidth} decelerationRate='fast' horizontal >
          {CardToSwipe}
        </ScrollView >
      </View>
    )};
}

export default HomeScreen;

const styles = StyleSheet.create({
  buttonDate: {
    backgroundColor: "#FFEEDD",
    padding: 10,
    width: 50,
    height: 50,
    borderRadius: 30,
    borderColor:'#5571D7',
    shadowColor: "black",
    shadowOffset: {width: 1, height:1},
    shadowOpacity: 0.5
  },
  textTitle :{
    fontFamily: 'Montserrat_800ExtraBold', 
    fontWeight: "900", 
    fontSize: 26, 
    lineHeight: 32,
    textAlign: 'center',
    color: '#5571D7',
  },
  cardContainer:{
    width: windowWidth-40,
    marginHorizontal:20,
    marginVertical:10,
    backgroundColor: "#FFEEDD",
    display:'flex',
    flexDirection: 'column',
    justifyContent:'space-between',
    alignItems:'center',
    paddingHorizontal:20,
    borderRadius:15,
    shadowColor: "black",
    shadowOpacity: 0.5,
    shadowOffset: {width: 0, height:2},
  },
  topCard:{
    display:'flex',
    flexDirection:'column',
    justifyContent:'space-between',
    alignItems:'center',
    height:windowHeight/4.5,
    marginTop:10
  },
  problemDesc:{
    display:'flex',
    flexDirection:'column',
    justifyContent:'flex-start',
    alignItems:'flex-start',
    width: '100%'
  },
  problemContainer:{
    width:'100%',
    display:'flex',
    flexDirection:'column',
    justifyContent:'flex-start',
    alignItems:'flex-start',
    marginTop:10
  },
  problemBadge:{
    width:'100%',
    display:'flex',
    flexDirection:'row',
    justifyContent:'flex-start',
    flexWrap:'wrap'
  },
  buttonSend:{
    backgroundColor: "#5571D7",
    padding: 10,
    width: 50,
    height: 50,
    borderRadius: 30,
    borderColor:'#5571D7',
    shadowColor: "black",
    shadowOffset: {width: 1, height:1},
    shadowOpacity: 0.5,
    display: 'flex',
    justifyContent:'center',
    alignItems:'center'
  },
  buttonInfo:{
    backgroundColor: "#5571D7",
    width: 50,
    height: 50,
    borderRadius: 30,
    borderColor:'#5571D7',
    shadowColor: "black",
    shadowOffset: {width: 1, height:1},
    shadowOpacity: 0.5,
    display: 'flex',
    justifyContent:'center',
    alignItems:'center', 
  },
  badge : {
    backgroundColor:'#5571D7',
    margin:2,
    fontSize:10,
    borderRadius: 30
  },
  fontBadge: {
    color:'white',
    marginHorizontal:15,
    marginVertical:5,
    fontFamily: "Montserrat_700Bold",
  },
  pseudo :{
    textAlign: "center",
    fontSize:20,
    color: "#5571D7",
    fontFamily: "Montserrat_700Bold",
  },
  member : {
    textAlign: "center",
    color: "#909090",
    fontFamily: "Montserrat_700Bold",
    fontStyle: 'italic',
    marginTop: 5
  },
  subtitle :{ 
    color: "#EC9A1F",
    fontSize:16,
    fontFamily: "Montserrat_700Bold"
  },
  sendButton :{
    alignSelf: 'center',
    marginLeft:3,
    marginBottom:5,
    transform: [{rotate:'-45deg'}]
  }
  })