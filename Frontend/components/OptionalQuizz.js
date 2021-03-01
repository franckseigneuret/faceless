import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import {connect} from 'react-redux';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

import {
    useFonts,
    Montserrat_700Bold,
    Montserrat_900Black,
    Montserrat_800ExtraBold,
  } from "@expo-google-fonts/montserrat";


function optionalQuizz(props) {
console.log(props.userDisplay)
    let [fontsLoaded] = useFonts({
        Montserrat_700Bold,
        Montserrat_900Black,
        Montserrat_800ExtraBold,
      });

    return(
        <View style={{flex: 1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
           <Text>TEST OPTIONAL QUIZZ</Text>
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