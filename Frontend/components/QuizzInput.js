import colors from '../colors'
import React from 'react';
import { Button } from 'react-native-elements';
import { StyleSheet, Text, View, Dimensions } from 'react-native';

import {
    useFonts,
    Montserrat_700Bold,
    Montserrat_900Black,
    Montserrat_800ExtraBold,
  } from "@expo-google-fonts/montserrat";

export default function QuizzInput(props) {

  var handleClick = () => {
      props.handleClickParent();
  }

    let [fontsLoaded] = useFonts({
        Montserrat_700Bold,
        Montserrat_900Black,
        Montserrat_800ExtraBold,
      });

    return(
        <View style={styles.center}>
            <Button 
                    title={props.btnTitle}
                    type="solid"
                    buttonStyle={styles.buttonValider}
                    titleStyle={{
                    fontFamily: 'Montserrat_700Bold'
                    }}
                    onPress={() => handleClick()}
                /> 
        </View>
    );
};

const styles = StyleSheet.create({
  buttonValider: {
    backgroundColor: colors.HavelockBlue,
    borderRadius: 86,
    width: 159,
    margin: 50   
  },
  center: {
    flexDirection: "row",
    justifyContent: "center"
  }
});