import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  Switch,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Dimensions,
} from "react-native";
import { Button, Overlay } from "react-native-elements";
import AppLoading from "expo-app-loading";
import HTTP_IP_DEV from '../mon_ip'

import AsyncStorage from "@react-native-async-storage/async-storage";

import { Ionicons } from "@expo/vector-icons";

import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_700Bold,
  Montserrat_900Black,
  Montserrat_800ExtraBold,
} from "@expo-google-fonts/montserrat";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function ProfilScreen() {
  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
    Montserrat_900Black,
    Montserrat_800ExtraBold,
  });

  // Switch du bottom
  const toggleSwitchDelete = () =>
    setIsEnabledDelete((previousState) => !previousState);
  const toggleSwitchDesactivate = () =>
    setIsEnabledDesactivate((previousState) => !previousState);

  // Overlay
  const [visible, setVisible] = useState(false);

  const toggleOverlayDescription = () => {
    setVisible(!visible);
  };

  // State user from token
  //{pseudo, mail, ville , mdp , gender, pblDescription, prblType}
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [localisation, setLocalisation] = useState("");
  const [password, setPassword] = useState("");
  const [genderFromToken, setGenderFromToken] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [problemType, setProblemType] = useState("");

  // State pour les modifs de profils
  const [isEnabledDelete, setIsEnabledDelete] = useState(false);
  const [isEnabledDesactivate, setIsEnabledDesactivate] = useState(false);

  const [emailVisible, setEmailVisible] = useState(false);
  const [emailText, setEmailText] = useState("");

  const [cityVisible, setCityVisible] = useState(false);
  const [cityText, setCityText] = useState("");

  const [mdpVisible, setMdpVisible] = useState(false);
  const [mdpText, setMdpText] = useState("");

  const [descriptionText, setDescriptionText] = useState("");

  // Changement de la couleur button enregistrer bottom
  const [saveButton, setSaveButton] = useState(false);

  const [gender, setGender] = useState("");
  const [isSelected, setIsSelected] = useState(-1);

  const handlePressEmail = () => {
    setEmailVisible(!emailVisible);
    setSaveButton(true);
  };

  const handlePressCity = () => {
    setCityVisible(!cityVisible);
    setSaveButton(true);
  };

  const handlePressMdp = () => {
    setMdpVisible(!mdpVisible);
    setSaveButton(true);
  };

  const handleSaveDescription = () => {
    setVisible(!visible);
  };

  const handleSaveChange = () => {
    // AsyncStorage.getItem("tokenFromStorage", function(error, data) {
    //   console.log(data);
    // });
    console.log(emailText, "<--- email changé");
    async function updateUser() {
      await fetch(`${HTTP_IP_DEV}/update-profil`, {
        method: "PUT",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `tokenFront=123456789&emailFront=${emailText}&localisationFront=${cityText}&passwordFront=${mdpText}&genderFront=${gender}descriptionProblemFront=`,
      });
    }
    updateUser();
  };

  const handleDisconnect = () => {};

  useEffect(() => {
    console.log("app load");

    async function loadDATA() {
      var rawResponse = await fetch(`${HTTP_IP_DEV}/loadProfil`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "tokenFront=z9iNwb7cTgGOhUrrvndz9rOHJCkxGAqo",
      });
      var response = await rawResponse.json();
      console.log(response.userFromBack, "response ");

      var pseudo = response.userFromBack.pseudo;
      setPseudo(pseudo);

      var email = response.userFromBack.email;
      setEmail(email);

      var localisation = response.userFromBack.localisation;
      setLocalisation(localisation);

      var password = response.userFromBack.password;
      setPassword(password);

      var gender = response.userFromBack.gender;
      setGenderFromToken(gender);

      var problemDescription = response.userFromBack.problem_description;
      setProblemDescription(problemDescription);

      var problemType = response.userFromBack.problems_types;
      setProblemType(problemType);
    }
    loadDATA();

    // recuperer les infos du user grace au fetch
    // creer des variables {pseudo, mail, ville , mdp , gender, pblDescription, prblType}
    // set states de ces infos
    //
  }, []);

  var updateGender = (index) => {
    if (index === 0) {
      setGender("other");
    } else if (index === 1) {
      setGender("male");
    } else if (index === 2) {
      setGender("female");
    }
  };
  console.log(gender);

  var images = [
    {
      unSelected: (
        <Image
          source={require("../assets/gender_1.png")}
          style={styles.sizeImg}
        />
      ),
      selected: (
        <Image
          source={require("../assets/gender_1_selected.png")}
          style={styles.sizeImg}
        />
      ),
    },
    {
      unSelected: (
        <Image
          source={require("../assets/gender_male.png")}
          style={styles.sizeImg}
        />
      ),
      selected: (
        <Image
          source={require("../assets/gender_male_selected.png")}
          style={styles.sizeImg}
        />
      ),
    },
    {
      unSelected: (
        <Image
          source={require("../assets/gender_female.png")}
          style={styles.sizeImg}
        />
      ),
      selected: (
        <Image
          source={require("../assets/gender_female_selected.png")}
          style={styles.sizeImg}
        />
      ),
    },
  ];

  var image = images.map((img, key) => {
    return (
      <TouchableOpacity
        key={key}
        onPress={() => {
          setIsSelected(key), updateGender(key);
        }}
      >
        {isSelected === key ? img.selected : img.unSelected}
      </TouchableOpacity>
    );
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={styles.container}>
      {/* UPPER SECTION  ---> Info */}

      <View>
        <Text style={styles.titleHome}>Mon Profil</Text>
      </View>

      <View style={{ marginTop: 15 }}>
        <Image source={require("../assets/women_2.png")} />
      </View>

      <View style={styles.viewHead}>
        <Text style={styles.pseudo}>
          {pseudo}
          <Ionicons name="lock-closed" size={18} color="#5571D7" />
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.viewContent}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.viewContent}>
            {!emailVisible ? (
              <>
                <Text style={styles.subtitle}>{email}</Text>
                <TouchableOpacity onPress={handlePressEmail}>
                  <Ionicons name="pencil" size={18} color="#5571D7" />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TextInput
                  style={styles.subtitleChanged}
                  placeholder={emailText}
                  onChangeText={(value) => {
                    setEmailText(value);
                  }}
                  defaultValue={emailText}
                />
              </>
            )}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.viewContent}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.viewContent}>
            {!cityVisible ? (
              <>
                <Text style={styles.subtitle}>{localisation} </Text>
                <TouchableOpacity onPress={handlePressCity}>
                  <Ionicons name="pencil" size={18} color="#5571D7" />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TextInput
                  style={styles.subtitleChanged}
                  placeholder="Tu peux changer ta ville  "
                  onChangeText={(value) => setCityText(value)}
                  defaultValue={cityText}
                />
              </>
            )}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.viewContent}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.viewContent}>
            {!mdpVisible ? (
              <>
                <Text style={styles.subtitle}>Mot de passe : {password} </Text>
                <TouchableOpacity onPress={handlePressMdp}>
                  <Ionicons name="pencil" size={18} color="#5571D7" />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TextInput
                  secureTextEntry={true}
                  style={styles.subtitleChanged}
                  placeholder="Ton nouveau mot de passe"
                  onChangeText={(value) => setMdpText(value)}
                  defaultValue={mdpText}
                />
              </>
            )}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        {image}
      </View>

      {/* BELOW SECTION  ---> Description & type of problem */}

      <View style={styles.viewTitleOrange}>
        <Text style={styles.title}>
          En quelques mots:
          <TouchableOpacity onPress={toggleOverlayDescription}>
            <Ionicons name="pencil" size={18} color="#5571D7" />
          </TouchableOpacity>
        </Text>
      </View>

      <ScrollView>
        <View style={{ width: "88%" }}>
          <Text style={styles.text}>{problemDescription}</Text>
        </View>
      </ScrollView>

      <Overlay
        isVisible={visible}
        onBackdropPress={toggleOverlayDescription}
        backdropStyle={{ opacity: 0.8, backgroundColor: "#FFF1E2" }}
        overlayStyle={styles.overlay}
      >
        <Text style={styles.title}>En quelques mots:</Text>
        <TextInput
          onChangeText={(value) => {
            setDescriptionText(value);
          }}
          style={{
            backgroundColor: "white",
            borderRadius: 25,
            width: "100%",
            paddingVertical: 40,
            marginVertical: 15,
          }}
        ></TextInput>
        <Button
          title="enregistrer"
          type="solid"
          buttonStyle={styles.buttonValider}
          titleStyle={{
            fontFamily: "Montserrat_700Bold",
          }}
          onPress={() => handleSaveDescription()}
        />
      </Overlay>

      <ScrollView>
        <View style={{ width: "88%" }}>
          <Text style={styles.text}>{descriptionText}</Text>
        </View>
      </ScrollView>
      <View style={styles.viewTitleOrange}>
        <Text style={styles.title}>Type de problème(s): </Text>
      </View>

      <View style={styles.viewSaveDisconnect}>
        <Button
          title="enregistrer"
          type="solid"
          buttonStyle={
            saveButton ? styles.buttonValider : styles.buttonValiderBIS
          }
          titleStyle={{
            fontFamily: "Montserrat_700Bold",
          }}
          onPress={handleSaveChange}
        />

        <Button
          title="déconnexion"
          type="solid"
          buttonStyle={styles.buttonDisconnect}
          titleStyle={{
            fontFamily: "Montserrat_700Bold",
          }}
          onPress={() => handleDisconnect()}
        />
      </View>

      <View style={styles.viewDeleteDisable}>
        <Text style={styles.textFin}>Supprimer mon compte </Text>

        <Text style={styles.textFin}> Désactiver mon compte</Text>
      </View>

      <View style={styles.viewToggle}>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isEnabledDelete ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitchDelete}
          value={isEnabledDelete}
        />

        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isEnabledDesactivate ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitchDesactivate}
          value={isEnabledDesactivate}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#FFF1E2",
    alignItems: "center",
    height: windowHeight,
    flexDirection: "column",
  },
  viewHead: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
    marginTop: 10,
  },
  viewContent: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
    marginTop: 3,
  },
  viewTitleOrange: {
    alignItems: "flex-start",
    width: "88%",
    marginTop: 15,
    marginBottom: 10,
  },
  viewSaveDisconnect: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    alignItems: "flex-end",
    marginTop: 15,
    marginBottom: 5,
  },
  viewDeleteDisable: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    marginTop: 15,
    marginBottom: 5,
  },
  viewToggle: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    marginTop: 15,
    marginBottom: 5,
  },
  titleHome: {
    textAlign: "center",
    color: "#5571D7",
    fontSize: 28,
    fontFamily: "Montserrat_800ExtraBold",
    marginTop: 50,
  },
  pseudo: {
    textAlign: "center",
    color: "#5571D7",
    fontFamily: "Montserrat_700Bold",
  },
  subtitle: {
    textAlign: "center",
    color: "#303030",
    fontFamily: "Montserrat_800ExtraBold",
    fontStyle: "italic",
  },
  subtitleChanged: {
    textAlign: "center",
    color: "#BCC8F0",
    fontFamily: "Montserrat_800ExtraBold",
    fontStyle: "italic",
  },
  title: {
    color: "#EC9A1F",
    fontFamily: "Montserrat_700Bold",
    width: "85%",
  },
  text: {
    textAlign: "left",
    color: "#264653",
    fontFamily: "Montserrat_400Regular",
  },
  textFin: {
    alignItems: "center",
    textAlign: "center",
    color: "#BCC8F0",
    fontFamily: "Montserrat_800ExtraBold",
    fontSize: 10,
  },
  sizeImg: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    marginTop: 5,
  },
  buttonValider: {
    backgroundColor: "#5571D7",
    borderRadius: 86,
    width: 159,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  buttonValiderBIS: {
    backgroundColor: "#BCC8F0",
    borderRadius: 86,
    width: 159,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  buttonDisconnect: {
    backgroundColor: "#D75555",
    borderRadius: 86,
    width: 159,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  input: {
    height: 40,
    borderColor: "#000000",
    borderBottomWidth: 1,
    marginBottom: 36,
  },
  overlay: {
    backgroundColor: "#FDEDDC",
    textAlign: "center",
    alignItems: "center",
    width: "80%",
    borderColor: "#2d3436",
  },
});
