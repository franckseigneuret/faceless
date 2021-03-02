import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import QuizzTitre from "./QuizzTitre"
import BlueButton from './BlueButton';

import {
    useFonts,
    Montserrat_700Bold,
    Montserrat_900Black,
    Montserrat_800ExtraBold,
  } from "@expo-google-fonts/montserrat";

export default function QuizzLocalisation(props) {

  const [localisation, setLocalisation] = useState("")

  var handleClick = () => {
    props.handleClickParent("localisation", localisation);
    console.log("Localisation")
  }

  var getInputValue = (value) => {
    setLocalisation(value)
  }

    let [fontsLoaded] = useFonts({
        Montserrat_700Bold,
        Montserrat_900Black,
        Montserrat_800ExtraBold,
      });

    return(
        <View style={styles.container}>
            <QuizzTitre title="Tu viens d'où ?" placeholder="ville, région, département..." getInputValueParent={getInputValue} type="border"/>
            <BlueButton btnTitle="enregistrer" handleClickParent={handleClick}/>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF1E2', 
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  }
});