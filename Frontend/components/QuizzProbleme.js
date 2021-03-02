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

export default function QuizzProbleme(props) {

  const [problem, setProblem] = useState("")

  // console.log("problem", problem)

  var handleClick = () => {
    props.handleClickParent("problem", problem);
  }

  var getInputValue = (value) => {
    setProblem(value)
  }

    let [fontsLoaded] = useFonts({
        Montserrat_700Bold,
        Montserrat_900Black,
        Montserrat_800ExtraBold,
      });

    return(
        <View style={styles.container}>
            <QuizzTitre title="Tu veux décrire ton problème ?" placeholder="..." getInputValueParent={getInputValue} type="inline"/>
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