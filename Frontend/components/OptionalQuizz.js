import React, { useState } from 'react';
import { View, Dimensions } from 'react-native';
import {connect} from 'react-redux';

import NavigationOptionalQuizz from "./NavigationOptionalQuizz"
import QuizzProbleme from "./QuizzProbleme"
import QuizzLocalisation from "./QuizzLocalisation"
import QuizzGender from "./QuizzGender"
import QuizzAvatar from "./QuizzAvatar"


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

import {
    useFonts,
    Montserrat_700Bold,
    Montserrat_900Black,
    Montserrat_800ExtraBold,
  } from "@expo-google-fonts/montserrat";


function optionalQuizz(props) {

  const [count, setCount] = useState(0)
  const [problem, setProblem] = useState("")
  const [localisation, setLocalisation] = useState("")
  const [gender, setGender] = useState("")
  const [avatar, setAvatar] = useState("")

  var handleClick = (type, data) => {
    if(type === "next"){
      setCount(count+1)
    }
    if(type === "prev"){
      setCount(count-1)
    }
    // if(type === "problem"){
    //   setProblem(data)
    // }
    // if(type === "localisation"){
    //   setLocalisation(data)
    // }
    // if(type === "gender"){
    //   console.log("gender")
    //   setGender(data)
    // }
    // if(type === "avatar"){
    //   console.log("avatar")
    //   setAvatar(data)
    // }
    // console.log("problem", problem)
    // console.log("localisation", localisation)
    // console.log("gender", gender)
    // console.log("avatar", avatar)
  }



console.log(props.userDisplay)
    let [fontsLoaded] = useFonts({
        Montserrat_700Bold,
        Montserrat_900Black,
        Montserrat_800ExtraBold,
      });
      
      if(count < 0){
        setCount(0)
      }
      if(count === 0){
        var composant = <QuizzProbleme handleClickParent={handleClick} />
      }
      if(count === 1){
        var composant = <QuizzLocalisation handleClickParent={handleClick}/>
      }
      if(count === 2){
        var composant = <QuizzGender handleClickParent={handleClick}/>
      }
      if(count === 3){
        var composant = <QuizzAvatar handleClickParent={handleClick}/>
      }


    return(
      <View style={{flex:1, backgroundColor: '#FFF1E2'}}>
        {composant}
        <NavigationOptionalQuizz handleClickParent={handleClick}/>
      </View>
    );
};

function mapStateToProps(state) {
  return { 
    userDisplay: state.user
   }
 }

 export default connect(
  mapStateToProps, 
  null
)(optionalQuizz);
