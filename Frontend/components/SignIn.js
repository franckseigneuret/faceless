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
    console.log(data.user.is_adult, "is adult ?????????");

    if (data.user.is_adult == true) {
      AsyncStorage.setItem(
        "filter",
        JSON.stringify({
          // si isAdult == true alors on set le min age du filter à l'âge de l'user et le max age à l'age de l'user +10 ans
          problemsTypes: problems,
          gender: "all",
          age: {
            minAge: Math.floor(differenceDates / (86400000 * 365)),
            maxAge: "all",
            isAdult: isAdult,
          },
          localisation: "France",
        })
      );
    } else {
      AsyncStorage.setItem(
        "filter",
        JSON.stringify({
          // sinon on set le min age du filter à l'âge et l'user et le max age à 18ans
          problemsTypes: problems,
          gender: "all",
          age: {
            minAge: Math.floor(differenceDates / (86400000 * 365)),
            maxAge: 17,
          },
          localisation: "France",
        })
      );
    }
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
        titleStyle={{
          fontFamily: "Montserrat_700Bold",
        }}
        buttonStyle={styles.buttonValider}
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
  buttonValider: {
    backgroundColor: "#5571D7",
    borderRadius: 86,
    width: 159,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginTop: windowHeight / 20,
    height: 40,
  },
});

export default SignIn;
