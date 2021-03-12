import HTTP_IP_DEV from '../mon_ip'
import colors from '../colors'
import React, { useState } from 'react';
import { Button } from 'react-native-elements';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

import {
  useFonts,
  Montserrat_700Bold,
  Montserrat_900Black,
  Montserrat_800ExtraBold,
} from "@expo-google-fonts/montserrat";
import { startClock } from 'react-native-reanimated';


function NavigationOptionalQuizz(props) {

  const [token, setToken] = useState('')

  AsyncStorage.getItem("token", function (error, data) {
    setToken(data)
  });

  var handleClick = async () => {
    console.log(token, '<)--------------- token');
    var rawResponse = await fetch(`${HTTP_IP_DEV}/sign-up-second-step`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `problemDescriptionFront=${props.userDisplay.problem_description}&genderFront=${props.userDisplay.gender}&localisationFront=${JSON.stringify(props.userDisplay.localisation)}&avatarFront=${props.userDisplay.avatar}&tokenFront=${token}`
    });
    var response = await rawResponse.json()
    // console.log(response, '<------<--------<--------<--- response after update')
  }

  let [fontsLoaded] = useFonts({
    Montserrat_700Bold,
    Montserrat_900Black,
    Montserrat_800ExtraBold,
  });

  return (
    <View style={styles.btn}>
      <Button
        title="Revoir"
        type="clear"
        icon={
          <Ionicons name="chevron-back-outline" size={24} color={colors.carrot} />
        }
        buttonStyle={props.step === 0 ? styles.hidden : {}}
        titleStyle={{
          color: colors.carrot,
          fontFamily: 'Montserrat_700Bold'
        }}
        onPress={() => props.onDecrease()}
      />
      <Button
        iconRight
        title="Passer"
        type="clear"
        icon={
          <Ionicons name="chevron-forward-outline" size={24} color={colors.HavelockBlue} />
        }
        buttonStyle={props.step === 3 ? styles.hidden : {}}
        titleStyle={{
          color: colors.HavelockBlue,
          fontFamily: 'Montserrat_700Bold',
        }}
        onPress={() => { props.onIncrease(); props.count == 3 ? handleClick() : null }}
      />
    </View>
  );
};

function mapDispatchToProps(dispatch) {
  return {
    onIncrease: function () {
      dispatch({ type: 'INCREASE_COUNT' })
    },
    onDecrease: function () {
      dispatch({ type: 'DECREASE_COUNT' })
    }
  }
}

function mapStateToProps(state) {
  return {
    userDisplay: state.user,
    count: state.count,
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavigationOptionalQuizz);

const styles = StyleSheet.create({
  hidden: {
    display: 'none',
  },
  btn: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 30,
    margin: 5
  },
});