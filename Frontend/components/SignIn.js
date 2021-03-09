import React, { useEffect, useState } from "react";
import { Button, Input } from "react-native-elements";
import { StyleSheet, View, Dimensions, Image, Text } from "react-native";
import AppLoading from "expo-app-loading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HTTP_IP_DEV from "../mon_ip";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_700Bold,
  Montserrat_900Black,
} from "@expo-google-fonts/montserrat";

function SignIn(props) {
  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
    Montserrat_900Black,
  });

  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  const [listErrorsSignIn, setErrorsSignIn] = useState([]);

  var handleSubmitSignIn = async () => {
    console.log("Before Fetch");
    console.log(signInEmail, "on click signInEmail");
    console.log(signInPassword, "on click signInPassword");

    const rawData = await fetch(`${HTTP_IP_DEV}/sign-in`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `emailFromFront=${signInEmail}&passwordFromFront=${signInPassword}`,
    });
    const data = await rawData.json();
    console.log(data, "<----- After Fetch");

    if (data.result == true) {
      AsyncStorage.setItem("token", data.token);
      props.navigation.navigate("BottomNavigator");
    }

    if (data.error) {
      setErrorsSignIn(data.error);
    }

    if (data.user.is_adult == true) {
      AsyncStorage.setItem(
        "filter",
        JSON.stringify({
          // si isAdult == true alors on set le min age du filter à l'âge de l'user et le max age à l'age de l'user +10 ans
          problemsTypes: data.user.problems_types, // problems
          gender: ['other', 'male', 'female'],
          age: {
            minAge: 18,
            maxAge: 100,
          },
          localisation: "France",
        })
      );
    } else {
      AsyncStorage.setItem(
        "filter",
        JSON.stringify({
          // sinon on set le min age du filter à l'âge et l'user et le max age à 18ans
          problemsTypes: data.user.problems_types, 
          gender: ['other', 'male', 'female'],
          age: {
            minAge: 13, //Math.floor(new Date(new Date() - data.user.birthDate))
            maxAge: 17,
          },
          localisation: "France",
        })
      );
    }

    AsyncStorage.getItem("filter", function(error, data) {
      console.log(data, 'DATA DU ASYNC ')
  })
  };

  var tabErrorsSignIn = listErrorsSignIn.map((error, i) => {
    return <Text style={{ fontFamily: "Montserrat_700Bold" }}>{error}</Text>;
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.textTitle}>Bon retour !</Text>
      <View style={styles.containerInput}>
        <Input
          placeholder="helicoptere530@gmail.com"
          inputContainerStyle={styles.inputConnect}
          onChangeText={(value) => setSignInEmail(value)}
          value={signInEmail}
        ></Input>
        <Input
          secureTextEntry={true}
          placeholder="Ton mot de passe"
          inputContainerStyle={styles.inputConnect}
          onChangeText={(value) => setSignInPassword(value)}
          value={signInPassword}
        ></Input>
      </View>
      {tabErrorsSignIn}
      <Button
              title="connexion"
              type="solid"
              buttonStyle={styles.buttonNext}
              titleStyle={{
                fontFamily: "Montserrat_700Bold",
              }}
              onPress={() => handleSubmitSignIn()}
            />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF1E2",
    alignItems: "center",
    height: windowHeight,
    flexDirection: "column",
    justifyContent: "center",
  },
  containerInput: {
    marginTop: 30,
  },
  textTitle: {
    color: "#5571D7",
    fontFamily: "Montserrat_900Black",
    fontSize: 43,
    width: "75%",
  },
  inputConnect: {
    width: "75%",
  },
  buttonNext: {
    backgroundColor: "#5571D7",
    marginTop:40,
    borderRadius: 86,
    width: 200,
    margin: 10,
  },
});

export default SignIn;
