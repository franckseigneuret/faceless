import React, { useState } from 'react';
import { Input, Button } from 'react-native-elements';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import { Ionicons } from '@expo/vector-icons'; 




const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

import {
    useFonts,
    Montserrat_700Bold,
    Montserrat_900Black,
    Montserrat_800ExtraBold,
  } from "@expo-google-fonts/montserrat";
import { startClock } from 'react-native-reanimated';


export default function NavigationOptionalQuizz(props) {

  const [count, setcount] = useState(0)

  var handleClick = (type) => {
    props.handleClickParent(type);
  }

    let [fontsLoaded] = useFonts({
        Montserrat_700Bold,
        Montserrat_900Black,
        Montserrat_800ExtraBold,
      });

    return(
        <View style={styles.btn}>
            <Button 
            title="Revoir"
            type="clear"
            icon={
            <Ionicons name="chevron-back-outline" size={24} color="#EC9A1F" />
            }
            buttonStyle={styles.buttonNext}
            titleStyle={{
            color: '#EC9A1F',
            fontFamily: 'Montserrat_700Bold'
            }}
            onPress={() => handleClick("prev")}
            />
            <Button 
            iconRight
            title="Passer"
            type="clear"
            icon={
            <Ionicons name="chevron-forward-outline" size={24} color="#5571D7" />
            }
            titleStyle={{
            color: '#5571D7',
            fontFamily: 'Montserrat_700Bold',
            }}
            onPress={() => handleClick("next")}
            /> 
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
  btn: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 30,
    margin: 5
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