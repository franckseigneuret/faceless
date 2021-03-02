import React, { useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView } from 'react-native';

import QuizzTitre from "./QuizzTitre"
import BlueButton from './BlueButton';

import Geolocalisation from "./Geolocalisation"

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
    // console.log("Localisation")
  }

  var getValue = (value) => {
    setLocalisation(value)
    console.log("lala", value)
  }

  let [fontsLoaded] = useFonts({
    Montserrat_700Bold,
    Montserrat_900Black,
    Montserrat_800ExtraBold,
  });

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <QuizzTitre title="Tu viens d'où ?" />
        <Geolocalisation getValueParent={getValue}/>
        <BlueButton btnTitle="enregistrer" handleClickParent={handleClick} />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});