import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

import {
    useFonts,
    Montserrat_700Bold,
    Montserrat_900Black,
    Montserrat_800ExtraBold,
  } from "@expo-google-fonts/montserrat";


export default function registration(props) {

    let [fontsLoaded] = useFonts({
        Montserrat_700Bold,
        Montserrat_900Black,
        Montserrat_800ExtraBold,
      });

    return(
        <View style={{flex: 1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
           <Text>TEST REGISTRATION</Text>
        </View>
    );
};
