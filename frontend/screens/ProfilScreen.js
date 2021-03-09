import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  Modal,
  Pressable,
  Alert,
} from "react-native";

import { Button, Overlay } from "react-native-elements";
import AppLoading from "expo-app-loading";
import HTTP_IP_DEV from "../mon_ip";

import AsyncStorage from "@react-native-async-storage/async-storage";

import Geolocalisation from "../components/Geolocalisation";

import BlueButton from "../components/BlueButton";

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

  const [visibleAvatar, setVisibleAvatar] = useState(false);

  // State user from token

  const [tokenAsync, setTokenAsync] = useState("");

  //{pseudo, mail, ville , mdp , gender, pblDescription, prblType}
  const [avatar, setAvatar] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [localisation, setLocalisation] = useState({});
  const [password, setPassword] = useState("");
  const [genderFromToken, setGenderFromToken] = useState("");
  const [problemDescription, setProblemDescription] = useState("");

  // Tableau type de probs
  const [problems, setProblems] = useState(["Amoureux"]);

  // State pour les modifs de profils
  const [emailVisible, setEmailVisible] = useState(false);
  const [cityVisible, setCityVisible] = useState(false);
  const [mdpVisible, setMdpVisible] = useState(false);

  // A FAIRE POUR QUE LE USER NE VOIT PAS SES MODIF AVANT D ENREGISTRER
  const [descriptionVisible, setDescriptionVisible] = useState(false);

  // Changement de la couleur button enregistrer bottom
  const [saveButton, setSaveButton] = useState(false);

  // State pour le gender
  const [gender, setGender] = useState("");
  const [isSelected, setIsSelected] = useState(-1);

  // state modal
  const [modalVisible, setModalVisible] = useState(false);

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

      console.log(response, "RESPONSE DU LOAD DATA");

      var avatar = response.userFromBack.avatar;
      setAvatar(avatar);

      var pseudo = response.userFromBack.pseudo;
      setPseudo(pseudo);

      var email = response.userFromBack.email;
      setEmail(email);

      var localisation = response.userFromBack.localisation.label;
      setLocalisation(localisation);

      var gender = response.userFromBack.gender;
      setGender(gender);
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

      var problems_types = response.userFromBack.problems_types;
      setProblems(problems_types);
    }
  }, []);

  const handleAvatar = () => {
    console.log("ici");
    setVisibleAvatar(!visibleAvatar);
  };

  const handleClickOnAvatar = () => {};

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

  const handleSelectProblems = (element) => {
    var problemsCopy = [...problems];
    if (problemsCopy.includes(element) == false) {
      problemsCopy.push(element);
      setProblems(problemsCopy);
    } else {
      problemsCopy = problemsCopy.filter((e) => e != element);
      setProblems(problemsCopy);
    }
  };

  const handleSaveChange = () => {
    var problemsTypeStringify = JSON.stringify(problems);

    async function updateUser() {
      console.log(
        localisation,
        "<--- localisation changé localisation on ASYNC handleSaveChange"
      );

      var rawResponse = await fetch(`${HTTP_IP_DEV}/update-profil`, {
        method: "PUT",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `tokenFront=${tokenAsync}&avatarFront=${avatar}&emailFront=${email}&localisationFront=${localisation}&passwordFront=${password}&genderFront=${gender}&descriptionProblemFront=${problemDescription}&problemsTypeFront=${problemsTypeStringify}`,
      });
      var response = await rawResponse.json();

      console.log(response, "-------- RESPONSE --------");

      if (response.userSaved.avatar) {
        setAvatar(response.userSaved.avatar);
      }

      if (response.userSaved.email) {
        setEmail(response.userSaved.email);
        setEmailVisible(false);
      }

      if (response.userSaved.localisation) {
        setLocalisation(response.userSaved.localisation);
        setCityVisible(false);
      }

      if (response.userSaved.password) {
        setMdpVisible(false);
      }

      if (response.userSaved.gender) {
        setGenderFromToken(response.userSaved.gender);
      }

      if (response.userSaved.problem_description) {
        setProblemDescription(response.userSaved.problem_description);
      }

      if (response.userSaved.problems_types) {
        setProblems(response.userSaved.problems_types);
      }
    }
    updateUser();

    setSaveButton(false);
  };

  const handleDisconnect = () => {
    AsyncStorage.removeItem("token");
    props.navigation.navigate("Registration");
    console.log(tokenAsync, "<---- token supprime");
  };

  const handleDeactivate = () => {
    async function deactivateUser() {
      var rawResponse = await fetch(`${HTTP_IP_DEV}/delete-my-profil`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `tokenFront=${tokenAsync}`,
      });
      var response = await rawResponse.json();

      if (response.result === true) {
        props.navigation.navigate("Registration");
      }
    }
    deactivateUser();
  };

  var updateGender = (index) => {
    if (index === 0) {
      setGender("other");
      setSaveButton(true);
    } else if (index === 1) {
      setGender("male");
      setSaveButton(true);
    } else if (index === 2) {
      setGender("female");
      setSaveButton(true);
    }
  };

  var imgAvatarSrc = [
    "https://i.imgur.com/HgBDc9B.png",
    "https://i.imgur.com/NBYvxKX.png",
    "https://i.imgur.com/urOQgGD.png",
    "https://i.imgur.com/clPw5Nx.png",
    "https://i.imgur.com/Wm5vVmF.png",
    "https://i.imgur.com/YSesoUz.png",
    "https://i.imgur.com/mMzuMuT.png",
    "https://i.imgur.com/EHaBuT9.png",
    "https://i.imgur.com/21c3YgT.png",
    "https://i.imgur.com/17T5sWH.png",
    "https://i.imgur.com/97zBLZM.png",
    "https://i.imgur.com/aK9HbPT.png",
    "https://i.imgur.com/T7wBkkk.png",
    "https://i.imgur.com/fJYbMZO.png",
  ];

  var imgAvatar = imgAvatarSrc.map((url, key) => {
    return (
      <TouchableOpacity
        key={key}
        url={url}
        onPress={() => {
          setAvatar(url);
        }}
      >
        <Image
          source={{ uri: url }}
          style={{ margin: 7 }}
          style={{ width: 100, height: 100, marginHorizontal: 5 }}
        />
      </TouchableOpacity>
    );
  });

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

  var problemsBadge = [
    <TouchableOpacity
      onPress={() => {
        handleSelectProblems(`Amoureux`);
      }}
      style={problems.includes("Amoureux") ? styles.badgeBis : styles.badge}
    >
      <Text style={styles.fontBadge}>Amoureux</Text>
    </TouchableOpacity>,
    <TouchableOpacity
      onPress={() => {
        handleSelectProblems(`Familial`);
      }}
      style={problems.includes("Familial") ? styles.badgeBis : styles.badge}
    >
      <Text style={styles.fontBadge}>Familial</Text>
    </TouchableOpacity>,
    <TouchableOpacity
      onPress={() => {
        handleSelectProblems(`Physique`);
      }}
      style={problems.includes("Physique") ? styles.badgeBis : styles.badge}
    >
      <Text style={styles.fontBadge}>Physique</Text>
    </TouchableOpacity>,
    <TouchableOpacity
      onPress={() => {
        handleSelectProblems(`Professionnel`);
      }}
      style={
        problems.includes("Professionnel") ? styles.badgeBis : styles.badge
      }
    >
      <Text style={styles.fontBadge}>Professionnel</Text>
    </TouchableOpacity>,
    <TouchableOpacity
      onPress={() => {
        handleSelectProblems(`Scolaire`);
      }}
      style={problems.includes("Scolaire") ? styles.badgeBis : styles.badge}
    >
      <Text style={styles.fontBadge}>Scolaire</Text>
    </TouchableOpacity>,
  ];

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
            justifyContent: "center",
          }}
        >
          <Text style={styles.titleHome}>Mon Profil</Text>

          <TouchableOpacity onPress={handleAvatar}>
            <Image
              style={{ marginVertical: 15, width: 80, height: 80 }}
              source={{ uri: avatar }}
            />
          </TouchableOpacity>

          <Overlay
            isVisible={visibleAvatar}
            onBackdropPress={handleAvatar}
            overlayStyle={{
              height: "30%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#FFF1E2",
              textAlign: "center",
              width: "80%",
              borderColor: "#2d3436",
            }}
            backdropStyle={{ opacity: 0.8, backgroundColor: "#FFF1E2" }}
          >
            <Ionicons name="chevron-back-outline" size={40} color="#5571D7" />
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              {imgAvatar}
            </ScrollView>
            <Ionicons
              name="chevron-forward-outline"
              size={40}
              color="#5571D7"
            />
          </Overlay>

          <Text style={styles.pseudo}>
            {pseudo}
            <Ionicons name="lock-closed" size={18} color="#5571D7" />
          </Text>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.viewContent}
        >
          <Text style={styles.title}>Change tes infos : </Text>
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
                  onChangeText={(value) => setEmail(value)}
                  value={email}
                  placeholder="Ton email"
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

          <Text style={styles.title}>Change ta ville : </Text>
          <View style={styles.containerContent}>
            <Geolocalisation lieu={localisation} getValueParent={() => {}} />
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

        <View>
          <View style={styles.badgeContainer}>{problemsBadge}</View>
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
            title="Supprimer mon compte"
            type="solid"
            buttonStyle={styles.buttonEnd}
            titleStyle={{
              fontFamily: "Montserrat_700Bold",
            }}
            onPress={() => handleDeactivate()}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF1E2",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
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
    backgroundColor: "#FFF1E2",
    textAlign: "center",
    alignItems: "center",
    width: "80%",
    borderColor: "#2d3436",
  },
  badge: {
    backgroundColor: "#BCC8F0",
    margin: 2,
    fontSize: 10,
    borderRadius: 30,
    marginVertical: 5,
    marginHorizontal: 3,
  },
  badgeBis: {
    backgroundColor: "#5571D7",
    margin: 2,
    fontSize: 10,
    borderRadius: 30,
    marginVertical: 5,
  },
  fontBadge: {
    color: "white",
    marginHorizontal: 15,
    marginVertical: 5,
    fontFamily: "Montserrat_700Bold",
    fontSize: 16,
  },
  badgeContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    width: "100%",
  },
});
