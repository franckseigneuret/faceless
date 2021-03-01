import React, { useState } from 'react';
import { Input, Button } from 'react-native-elements';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import {connect} from 'react-redux';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import { Ionicons } from '@expo/vector-icons'; 

import NavigationOptionalQuizz from "./NavigationOptionalQuizz"
import Probleme from "./Probleme"
import Geolocalisation from './Geolocalisation'


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

import {
    useFonts,
    Montserrat_700Bold,
    Montserrat_900Black,
    Montserrat_800ExtraBold,
  } from "@expo-google-fonts/montserrat";

import { startClock } from 'react-native-reanimated';


function optionalQuizz(props) {
console.log(props.userDisplay)
    let [fontsLoaded] = useFonts({
        Montserrat_700Bold,
        Montserrat_900Black,
        Montserrat_800ExtraBold,
      });

    return(
      <View style={{flex:1, backgroundColor: '#FFF1E2'}}>
        <Geolocalisation/>
        <NavigationOptionalQuizz/>
      </View>
    );
};

function mapStateToProps(state) {
  return { 
    userDisplay: state.user
   }
 }

 export default connect(
  mapStateToProps, 
  null
)(optionalQuizz);
