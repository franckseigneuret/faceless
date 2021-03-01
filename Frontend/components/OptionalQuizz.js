import React, { useState } from 'react';
import { Input, Button } from 'react-native-elements';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import { Ionicons } from '@expo/vector-icons'; 

import NavigationOptionalQuizz from "./NavigationOptionalQuizz"
import Probleme from "./Probleme"


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

import {
    useFonts,
    Montserrat_700Bold,
    Montserrat_900Black,
    Montserrat_800ExtraBold,
  } from "@expo-google-fonts/montserrat";

import { startClock } from 'react-native-reanimated';


export default function optionalQuizz(props) {

  const [count, setcount] = useState(0)

    let [fontsLoaded] = useFonts({
        Montserrat_700Bold,
        Montserrat_900Black,
        Montserrat_800ExtraBold,
      });

    return(
      <View style={{flex:1, backgroundColor: '#FFF1E2'}}>
        <Probleme/>
        <NavigationOptionalQuizz/>
      </View>
    );
};