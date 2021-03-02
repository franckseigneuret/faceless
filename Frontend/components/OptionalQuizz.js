import React, { useState, useEffect } from 'react';
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


function OptionalQuizz(props) {

  const [step, setStep] = useState(0)

  useEffect(() => {
    setStep(props.count)
  }, [props.count]);

  var handleClick = (type, data) => {
    if(type === "problem"){
      props.onAddUserProblem(data)
    }
    if(type === "localisation"){
      props.onAddUserLocalisation(data)
    }
    if(type === "gender"){
      props.onAddUserGender(data)
    }
    if(type === "avatar"){
      props.onAddUserAvatar(data)
    }
  }


// console.log(props.userDisplay)
    let [fontsLoaded] = useFonts({
        Montserrat_700Bold,
        Montserrat_900Black,
        Montserrat_800ExtraBold,
      });

    return(
      <View style={{flex:1, backgroundColor: '#FFF1E2'}}>
        {step === 0 && <QuizzProbleme handleClickParent={handleClick} />} 
        {step === 1 && <QuizzLocalisation handleClickParent={handleClick}/>} 
        {step === 2 && <QuizzGender handleClickParent={handleClick}/>} 
        {step === 3 && <QuizzAvatar handleClickParent={handleClick}/>} 
        {step === 4 &&  props.navigation.navigate('BottomNavigator', { screen: 'HomeScreen' })} 
        <NavigationOptionalQuizz/>
      </View>
    );
};
function mapStateToProps(state) {
 return { count: state.count }
}

function mapDispatchToProps(dispatch) {
  return {
    onAddUserProblem: function (arg) {
      dispatch({ type: 'ADD_PROBLEM', problem: arg })
    },
    onAddUserLocalisation: function (arg) {
      dispatch({ type: 'ADD_LOCALISATION', localisation: arg })
    },
    onAddUserGender: function (arg) {
      dispatch({ type: 'ADD_GENDER', gender: arg })
    },
    onAddUserAvatar: function (arg) {
      dispatch({ type: 'ADD_AVATAR', avatar: arg })
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OptionalQuizz);
