import React from 'react';
import { Button } from 'react-native-elements';
import { StyleSheet, View, Dimensions, Image } from 'react-native';

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
        <View style={styles.container}>
          <View style={styles.logo}>
            <Image
              source={require('../assets/logo-faceless.png')}
            />
          </View>
          <View  style={styles.btn}>
            <Button 
            title="S'inscrire"
            type="solid"
            buttonStyle={styles.buttonNext}
            titleStyle={{
              fontFamily: 'Montserrat_700Bold'
            }}
            onPress={() => props.navigation.navigate('Quizz')}
            /> 
            <Button 
            title="découvrir"
            type="clear"
            titleStyle={{
              color: '#EC9A1F',
              textDecorationLine: "underline",
              fontFamily: 'Montserrat_700Bold',
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonNext: {
    backgroundColor: '#5571D7',
    borderRadius: 86,
    width: 159,
    margin: 50   
  },
  logo: {
    flex: 1,
    height: windowHeight/2,
    display: "flex",
    alignItems: "flex-end",
    marginTop: windowHeight/5,
    margin: 0, 
  },
  btn: {
    flex: 1,
    marginTop: windowHeight/15,
  }
});
