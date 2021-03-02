import React, { useState } from 'react';
import { Input, Button } from 'react-native-elements';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import { Ionicons } from '@expo/vector-icons'; 

import NavigationOptionalQuizz from "./NavigationOptionalQuizz"


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
        <View style={styles.container}>
            <View style={styles.question}>
                <Text style={styles.textQuizz}>Tu veux décrire ton problème ?</Text>
                <Input
                    placeholder='...'
                    inputContainerStyle={styles.inputQuizz}
                />  
            </View>
            <View style={styles.center}>
                <Button 
                        title="enregistrer"
                        type="solid"
                        buttonStyle={styles.buttonValider}
                        titleStyle={{
                        fontFamily: 'Montserrat_700Bold'
                        }}
                        onPress={() => props.navigation.navigate('Quizz')}
                    /> 
            </View>
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
  },
  question: {
    marginTop: windowHeight/3,
    paddingLeft: windowWidth/10,
    paddingRight: windowWidth/10,
  },
  center: {
    flexDirection: "row",
    justifyContent: "center"
  },
  textQuizz: {
    color: '#5571D7',
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 22,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonValider: {
    backgroundColor: '#5571D7',
    borderRadius: 86,
    width: 159,
    margin: 50   
  },
});