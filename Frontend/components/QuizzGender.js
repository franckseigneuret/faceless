import React, { useState } from 'react';
import { StyleSheet, View, Image , TouchableOpacity } from 'react-native'; 

import BlueButton from './BlueButton';
import QuizzTitre from './QuizzTitre';

import {
    useFonts,
    Montserrat_700Bold,
    Montserrat_900Black,
    Montserrat_800ExtraBold,
  } from "@expo-google-fonts/montserrat";

export default function QuizzGender(props) {
  
  const [gender, setGender] = useState("")
  const [isSelected, setIsSelected] = useState(-1)

  var handleClick = () => {
    props.handleClickParent("gender", gender);
  }

  let [fontsLoaded] = useFonts({
      Montserrat_700Bold,
      Montserrat_900Black,
      Montserrat_800ExtraBold,
  });
  
  var images = [
    {unSelected: <Image source={require('../assets/gender_1.png')}/>, selected: <Image source={require('../assets/gender_1_selected.png')}/>},
    {unSelected: <Image source={require('../assets/gender_male.png')}/>, selected: <Image source={require('../assets/gender_male_selected.png')}/>},
    {unSelected: <Image source={require('../assets/gender_female.png')}/>, selected: <Image source={require('../assets/gender_female_selected.png')}/>},
  ];

  var image = images.map((img, key) => {
      return <TouchableOpacity key={key} onPress={() => {setIsSelected(key)}}>
       {isSelected === key ? img.selected : img.unSelected}
     </TouchableOpacity>
  })

  return(
      <View style={styles.container}>
        <QuizzTitre title="Tu es ?"/>
        <View style={{display: "flex", flexDirection:"row", justifyContent: "center"}}>
          {image}
          
        </View>
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