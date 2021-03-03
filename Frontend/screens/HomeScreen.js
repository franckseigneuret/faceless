import React, { useState } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Image } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {useFonts, Montserrat_400Regular, Montserrat_700Bold, Montserrat_900Black, Montserrat_800ExtraBold} from "@expo-google-fonts/montserrat";
import { Ionicons } from '@expo/vector-icons';
import AppLoading from 'expo-app-loading';
import { ScrollView } from 'react-native-gesture-handler';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeScreen(props) {

  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
    Montserrat_900Black,
    Montserrat_800ExtraBold,
  });

  const CardToSwipe = [
    <View style={styles.cardContainer}>
      <View style={styles.topCard}>
        <Image source={require('../assets/women_1.png')} style={{borderWidth:3, borderRadius:50, borderColor:'#EC9A1F'}}/>
        <Text style={styles.pseudo}>Gigatank3000</Text>
        <Text style={styles.member}>Membre depuis le 12 février 2020</Text>
        <Text style={{marginTop: 5}}><Ionicons name='location' size={15} /> Region de Lille</Text>
      </View>
      <View style={styles.problemDesc}>
        <Text style={styles.subtitle}>En quelques mots :</Text>
        <Text style={{ textAlign: "left", color: "#264653", fontFamily: "Montserrat_400Regular",}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ut felis venenatis arcu dapibus efficitur at sit amet ligula. Proin cursus neque pretium enim semper, vitae feugiat nisi faucibus.</Text>
      </View>
      <View style={styles.problemContainer}>
        <Text style={styles.subtitle}>Type de probleme(s)</Text>
        <View style={styles.problemBadge}>
          <View style={styles.badge}><Text style={styles.fontBadge}>Scolaire</Text></View>
          <View style={styles.badge}><Text style={styles.fontBadge}>Je suis super moche</Text></View>
          <View style={styles.badge}><Text style={styles.fontBadge}>Suicide</Text></View>
        </View>
        <View style={{display:'flex',flexDirection:'row', justifyContent:'space-between', width:'100%', padding:20}}>
        <TouchableOpacity 
                      style={styles.buttonInfo}
                    ><Text style={{fontSize:25, color:"#FFEEDD", fontFamily: 'Montserrat_700Bold',}}>i</Text>
        </TouchableOpacity>
        <TouchableOpacity 
                      style={styles.buttonSend}
                    ><Ionicons name="send" size={25} color="#FFEEDD" style={styles.sendButton}/>
        </TouchableOpacity>
        </View>
      </View>
    </View>
]

  


  var handleSubmit = () => {
  }

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor:'#FFEEDD'}}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent:'space-between', marginTop: 40, marginBottom:20, width: '65%', left:40}}>
        <Text style={styles.textTitle}>
          Salut Jib63 !
        </Text>
        <TouchableOpacity style={styles.buttonDate} onPress={ handleSubmit()}>
          <Ionicons name="funnel" size={25} color="#5571D7" style={{alignSelf: 'center', marginTop: 3}}/>
        </TouchableOpacity>
        </View>
        <ScrollView  snapToInterval={windowWidth} decelerationRate='fast' horizontal >
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
    justifyContent:'center',
    alignItems:'flex-start',
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