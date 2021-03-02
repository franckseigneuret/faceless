import React from 'react';
import { Animated, StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { Card, ListItem, Button, Icon } from 'react-native-elements'
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  useFonts,
  Montserrat_700Bold,
  Montserrat_900Black,
  Montserrat_800ExtraBold,
} from "@expo-google-fonts/montserrat";
import { Ionicons } from '@expo/vector-icons';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

import AppLoading from 'expo-app-loading';
import ProfilScreen from './ProfilScreen';
import { ScrollView } from 'react-native-gesture-handler';

const CardToSwipe = [
        <View style={{width:380}}>
          <Card >
            <Card.Title>1ST CARD</Card.Title>
            <Card.Divider/>
              <Text style={{marginBottom: 10}}>
                The idea with React .
              </Text>
          </Card>
          </View>,
          <View style={{width:380}}>
          <Card>
          <Card.Title>2ND CARD</Card.Title>
          <Card.Divider/>
            <Text style={{marginBottom: 10}}>
              The idea with React Native Elements is more about component structure than actual design.
            </Text>
          </Card>
          </View>,
          <View style={{width:380}}>
          <Card>
          <Card.Title>3RD CARD</Card.Title>
          <Card.Divider/>
            <Text style={{marginBottom: 10}}>
              The idea with React Native Elements is more about component structure than actual design.
            </Text>
          </Card>
          </View>
]

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeScreen(props) {

  let [fontsLoaded] = useFonts({
    Montserrat_700Bold,
    Montserrat_900Black,
    Montserrat_800ExtraBold,
  });

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

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
  }
  })