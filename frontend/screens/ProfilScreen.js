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

export default function ProfilScreen(props) {
  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
    Montserrat_900Black,
    Montserrat_800ExtraBold,
  });

  // Overlay
  const [visible, setVisible] = useState(false);

  const toggleOverlayDescription = () => {
    setVisible(!visible);
  };

  // State user from token

  const [tokenAsync, setTokenAsync] = useState("");

  //{pseudo, mail, ville , mdp , gender, pblDescription, prblType}
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [localisation, setLocalisation] = useState("");
  const [password, setPassword] = useState("");
  const [genderFromToken, setGenderFromToken] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [problemType, setProblemType] = useState([]);

  // State pour les modifs de profils
  const [emailVisible, setEmailVisible] = useState(false);
  const [cityVisible, setCityVisible] = useState(false);
  const [mdpVisible, setMdpVisible] = useState(false);

  // A FAIRE POUR QUE LE USER NE VOIT PAS SES MODIF AVANT D ENREGISTRER 
  const [descriptionVisible, setDescriptionVisible] = useState(false)
  

  // Changement de la couleur button enregistrer bottom
  const [saveButton, setSaveButton] = useState(false);

  // State pour le gender
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
    setSaveButton(true);
  };

  const handleSaveChange = () => {

    console.log(gender, "<--- gender changé");
    console.log(problemDescription, "<--- problemDescription changé");

    async function updateUser() {
      console.log(email, "<--- email changé email on ASYNC handleSaveChange");
      rawResponse = await fetch(`${HTTP_IP_DEV}/update-profil`, {
        method: "PUT",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `tokenFront=${tokenAsync}&emailFront=${email}&localisationFront=${localisation}&passwordFront=${password}&genderFront=${gender}&descriptionProblemFront=${problemDescription}`,
      });
      response = await rawResponse.json();

      console.log(response, "-------- RESPONSE --------");

      if (response.userSaved.email) {
        setEmail(response.userSaved.email);
        setEmailVisible(false);
      }

      if (response.userSaved.localisation) {
        setLocalisation(response.userSaved.localisation);
        setCityVisible(false);
      }

      if (response.userSaved.password) {
        setPassword(response.userSaved.password);
        setMdpVisible(false);
      }

      if (response.userSaved.gender) {
        setGenderFromToken(response.userSaved.gender);
      }

      if (response.userSaved.problem_description) {
        setProblemDescription(response.userSaved.problem_description);
        // setCityVisible(false);
      }

      // FAIRE LES TYPES DE PROBLEMES
    }
    updateUser();

    setSaveButton(false);
  };

  const handleDisconnect = () => {
    AsyncStorage.removeItem("token");
    props.navigation.navigate("Registration");
    console.log(tokenAsync, "<---- token supprime");
  };

  useEffect(() => {
    console.log("app load");

    AsyncStorage.getItem("token", function (error, data) {
      var userData = data;
      if (userData) {
        console.log(userData, "<--- userData pour le token du async");
        loadDATA(userData);
        setTokenAsync(userData);
      }
    });

    async function loadDATA(arg) {
      var rawResponse = await fetch(`${HTTP_IP_DEV}/loadProfil`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `tokenFront=${arg}`,
      });
      var response = await rawResponse.json();

      var pseudo = response.userFromBack.pseudo;
      setPseudo(pseudo);

      var email = response.userFromBack.email;
      setEmail(email);

      var localisation = response.userFromBack.localisation.label;
      setLocalisation(localisation);

      var password = response.userFromBack.password;
      setPassword(password);

      var gender = response.userFromBack.gender;
      if (gender == null) {
        setIsSelected(0);
      } 
      if (gender == "other") {
        setIsSelected(0);
      }
      if (gender == "male") {
        setIsSelected(1);
      }
      if (gender == "female") {
        setIsSelected(2);
      }

      var problemDescription = response.userFromBack.problem_description;
      setProblemDescription(problemDescription);

      var problemBack = response.userFromBack.problems_types;
      setProblemType(problemBack);
    }
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
    <ScrollView>
      <View style={styles.container}>
        {/* UPPER SECTION  ---> Info */}

        <View
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Text style={styles.titleHome}>Mon Profil</Text>

          <Image
            style={{ marginTop: 15 }}
            source={require("../assets/women_2.png")}
          />

          <Text style={styles.pseudo}>
            {pseudo}
            <Ionicons name="lock-closed" size={18} color="#5571D7" />
          </Text>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.viewContent}
        >
          <View style={styles.containerContent}>
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
                  onChangeText={(value) => 
                    setEmail(value)
                  }
                  value={email}
                  placeholder="Ton email"
                />
              </>
            )}
          </View>

          <View style={styles.containerContent}>
            {!cityVisible ? (
              <>
                <Text style={styles.subtitle}>
                  {/* localisation.label */}
                  {localisation == "" ? "France" : localisation}
                </Text>
                <TouchableOpacity onPress={handlePressCity}>
                  <Ionicons name="pencil" size={18} color="#5571D7" />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TextInput
                  style={styles.subtitleChanged}
                  placeholder="Tu peux changer ta ville  "
                  onChangeText={(value) => {
                    setLocalisation(value);
                  }}
                />
              </>
            )}
          </View>

          <View style={styles.containerContent}>
            {!mdpVisible ? (
              <>
                <Text style={styles.subtitle}>Mot de passe</Text>
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
                  onChangeText={(value) => setPassword(value)}
                  defaultValue={password}
                />
              </>
            )}
          </View>

          <Text style={styles.title}>Genre : </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              marginVertical: 10,
              justifyContent: "space-evenly",
              width: "100%",
            }}
          >
            {image}
          </View>

          {/* BELOW SECTION  ---> Description & type of problem */}

          <View
            style={{
              width: "85%",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <View style={styles.containerContent}>
              <Text style={styles.title}>En quelques mots:</Text>
              <TouchableOpacity onPress={toggleOverlayDescription}>
                <Ionicons name="pencil" size={18} color="#5571D7" />
              </TouchableOpacity>
            </View>
            <Text style={{ width: "100%" }} numberOfLines={4}>
              {problemDescription}
            </Text>
          </View>

          <Overlay
            isVisible={visible}
            onBackdropPress={toggleOverlayDescription}
            backdropStyle={{ opacity: 0.8, backgroundColor: "#FFF1E2" }}
            overlayStyle={styles.overlay}
          >
            <Text style={styles.title}>En quelques mots:</Text>
            <TextInput
              onChangeText={(value) => {
                setProblemDescription(value);
              }}
              value={problemDescription}
              style={{
                backgroundColor: "white",
                borderRadius: 25,
                width: "100%",
                paddingVertical: 40,
                marginVertical: 15,
              }}
            ></TextInput>
            <Button
              title="ok"
              type="solid"
              buttonStyle={styles.buttonValider}
              titleStyle={{
                fontFamily: "Montserrat_700Bold",
              }}
              onPress={() => handleSaveDescription()}
            />
          </Overlay>
        </KeyboardAvoidingView>

        <View style={styles.viewTitleOrange}>
          <Text style={styles.title}>Type de problème(s): </Text>
        </View>

        <View style={styles.problemBadge}>
          {problemType.map((arg, index) => {
            return (
              <View style={styles.badge} index={index}>
                <Text style={styles.fontBadge}>{arg}</Text>
              </View>
            );
          })}
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

        <View style={styles.viewSaveDisconnect}>
          <Button
            title="Désactiver mon compte"
            type="solid"
            buttonStyle={styles.buttonEnd}
            titleStyle={{
              fontFamily: "Montserrat_700Bold",
            }}
            onPress={() => handleDeactivate()}
          />

          <Button
            title="Supprimer mon compte"
            type="solid"
            buttonStyle={styles.buttonEnd}
            titleStyle={{
              fontFamily: "Montserrat_700Bold",
            }}
            onPress={() => handleDeactivate()}
          />
        </View>

        {/* <View style={styles.viewDeleteDisable}>
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
        </View> */}
      </View>
    </ScrollView>
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
  containerContent: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    marginVertical: 5,
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
    flexDirection: "column",
    alignItems: "flex-start",
    width: "85%",
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
    marginRight: 10,
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
    borderWidth: 2,
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
  problemBadge: {
    width: "90%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: "wrap",
  },
  badge: {
    backgroundColor: "#5571D7",
    margin: 2,
    fontSize: 10,
    borderRadius: 30,
  },
  fontBadge: {
    color: "white",
    marginHorizontal: 15,
    marginVertical: 5,
    fontFamily: "Montserrat_700Bold",
  },
  sizeImg: {
    width: 50,
    height: 50,
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
  buttonOK: {
    backgroundColor: "#5571D7",
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
  buttonEnd: {
    backgroundColor: "#5571D7",
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
