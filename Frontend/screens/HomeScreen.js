import React from 'react';
import { Animated, StyleSheet, Text, View, Dimensions, TouchableOpacity, Image } from 'react-native';
import { Card, ListItem, Button, Icon, Badge } from 'react-native-elements'
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  useFonts,
  Montserrat_700Bold,
  Montserrat_900Black,
  Montserrat_800ExtraBold,
} from "@expo-google-fonts/montserrat";
import { Ionicons } from '@expo/vector-icons';
import AppLoading from 'expo-app-loading';
import ProfilScreen from './ProfilScreen';
import { ScrollView } from 'react-native-gesture-handler';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;




const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeScreen(props) {

  const CardToSwipe = [
    <View style={styles.cardContainer}>
      <View style={styles.topCard}>
        <Image source={require('../assets/women_1.png')} style={{borderWidth:3, borderRadius:50, borderColor:'#EC9A1F'}}/>
        <Text>GIGATANK3000</Text>
        <Text>Membre depuis le 12 février 2020</Text>
        <Text><Ionicons name='location' size={30} /> Region de Lille</Text>
      </View>
      <View style={styles.problemDesc}>
        <Text>En quelques mots :</Text>
        <Text>slrkfjlskjxnr,gmkvscw slrkfjlskjxnrslrkfjlskjxnrslrkfjlskjxnrslrkfjlskjxnrslrkfjlskjxnr slrkfjlskjxnrslrkfjlskjxnr</Text>
      </View>
      <View style={styles.problemContainer}>
        <Text>Type de probleme(s)</Text>
        <View style={styles.problemBadge}>
          <Badge value='Scolaire' status='success'></Badge>
          <Badge value='De la merde' status='success'></Badge>
          <Badge value='Minaaaable' status='success'></Badge>
        </View>
        <View style={{display:'flex',flexDirection:'row', justifyContent:'space-between', width:'100%'}}>
        <TouchableOpacity 
                      style={styles.buttonSend}
                    ><Ionicons name="send" size={25} color="#FFEEDD" style={{alignSelf: 'center', marginLeft:3,marginBottom:5, transform: [{rotate:'-45deg'}]}}/>
        </TouchableOpacity>
        <TouchableOpacity 
                      style={styles.buttonInfo}
                    ><Text style={{fontSize:25, color:"#FFEEDD", fontFamily: 'Montserrat_700Bold',}}>i</Text>
        </TouchableOpacity>
        </View>
      </View>
    </View>
]

  let [fontsLoaded] = useFonts({
    Montserrat_700Bold,
    Montserrat_900Black,
    Montserrat_800ExtraBold,
  });


  var handleSubmit = () => {
  }

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {

    return (
     
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor:'#FFEEDD'}}>
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent:'space-between', marginTop: 50, width: '65%', left:40}}>
        <Text style={styles.textTitle}>
          Salut Jib63 !
        </Text>
        <TouchableOpacity
                      style={styles.buttonDate}
                      onPress={ handleSubmit()}
                    ><Ionicons name="funnel" size={25} color="#5571D7" style={{alignSelf: 'center', marginTop: 3}}/>
        </TouchableOpacity>
        </View>
        <ScrollView snapToInterval={windowWidth} decelerationRate='fast' horizontal style={styles.pictures}>
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
  pictures: {
    flexDirection: 'row',
    width: '100%',
  },
  cardContainer:{
    width: windowWidth,
    display:'flex',
    flexDirection: 'column',
    justifyContent:'center',
    alignItems:'center',
    borderWidth:1,
    marginHorizontal:20,

  },
  topCard:{
    display:'flex',
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
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
  },
  problemBadge:{
    width:'50%',
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
  }
  })