import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, Text, Switch, 
  TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, 
  TouchableWithoutFeedback, Keyboard } from "react-native";
import { Button, Overlay } from 'react-native-elements';
import AppLoading from 'expo-app-loading';

import { Ionicons } from '@expo/vector-icons'; 

import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_700Bold,
  Montserrat_900Black,
  Montserrat_800ExtraBold,
} from "@expo-google-fonts/montserrat";

export default function ProfilScreen() {

  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
    Montserrat_900Black,
    Montserrat_800ExtraBold,
  });

  // Switch du bottom 
  const toggleSwitchDelete = () => setIsEnabledDelete(previousState => !previousState);
  const toggleSwitchDesactivate = () => setIsEnabledDesactivate(previousState => !previousState);

  // Overlay 
  const [visible, setVisible] = useState(false);

  const toggleOverlayDescription = () => {
    setVisible(!visible);
  };

  // State pour les modifs de profils
  const [isEnabledDelete, setIsEnabledDelete] = useState(false);
  const [isEnabledDesactivate, setIsEnabledDesactivate] = useState(false);

  const [emailVisible, setEmailVisible] = useState(false);
  const [emailText, setEmailText] = useState('');

  const [cityVisible, setCityVisible] = useState(false);
  const [cityText, setCityText] = useState('');

  const [mdpVisible, setMdpVisible] = useState(false);
  const [mdpText, setMdpText] = useState('');

  // Changement de la couleur button enregistrer bottom
  const [saveButton, setSaveButton] = useState(false)

  const handlePressEmail = () => {
    setEmailVisible(!emailVisible)
    setSaveButton(true)
  }

  const handlePressCity = () => {
    setCityVisible(!cityVisible)
    setSaveButton(true)
  }

  const handlePressMdp = () => {
    setMdpVisible(!mdpVisible)
    setSaveButton(true)
  }

  const handleSaveDescription = () => {
    setSaveButton(true)
  }

  const handleSaveChange = () => {

  }

  const handleDisconnect = () => {
    
  }


  var emailToChange;
  var cityToChange;
  var mdpToChange;
  
  if(!emailVisible){
    emailToChange = <View style={styles.viewContent}>
                        <Text style={styles.subtitle}>nicole.kidman@poildecarotte.com</Text>
                        <TouchableOpacity onPress={handlePressEmail}>
                          <Ionicons name="pencil" size={18} color="#5571D7" />
                        </TouchableOpacity>
                    </View>
  } else {
    emailToChange = <View style={styles.viewContent}>
                        <TextInput style={styles.subtitleChanged} placeholder="Tu peux changer ton email  " onChangeText={emailText => setEmailText(emailText)} defaultValue={emailText} />
                    </View>
  }

  if(!cityVisible){
    cityToChange = <View style={styles.viewContent}>
                      <Text style={styles.subtitle}>Paris </Text>
                      <TouchableOpacity onPress={handlePressCity}>
                        <Ionicons name="pencil" size={18} color="#5571D7" />
                      </TouchableOpacity>
                  </View>
  } else {
    cityToChange = <View style={styles.viewContent}>
                      <TextInput style={styles.subtitleChanged} placeholder="Tu peux changer ta ville  " onChangeText={cityText => setCityText(cityText)} defaultValue={cityText} />
                    </View>
  }

  if(!mdpVisible){
    mdpToChange = <View style={styles.viewContent}>
                      <Text style={styles.subtitle}>Mot de passe : ******* </Text>
                      <TouchableOpacity onPress={handlePressMdp}>
                        <Ionicons name="pencil" size={18} color="#5571D7" />
                      </TouchableOpacity>
                  </View>
  } else {
    mdpToChange = <View style={styles.viewContent}>
                    <TextInput secureTextEntry={true} style={styles.subtitleChanged} placeholder="Ton nouveau mot de passe" onChangeText={mdpText => setMdpText(mdpText)} defaultValue={mdpText} />
                  </View>
  }

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={styles.container}>
      
      {/* UPPER SECTION  ---> Info */}

      <View>
        <Text style={styles.titleHome}>Mon Profil</Text>
      </View>

      <View style={{marginTop: 15}} >
        <Image source={require('../assets/women_2.png')}/>
      </View>

      <View style={styles.viewHead}>
        <Text style={styles.pseudo}>GigaTank3000 <Ionicons name="lock-closed" size={18} color="#5571D7" /></Text>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.viewContent}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          {emailToChange}
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.viewContent}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          {cityToChange}
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.viewContent}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          {mdpToChange}
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <View style={styles.viewHead}>
        <Text style={styles.subtitle}>Sexe </Text>
      </View>

      {/* BELOW SECTION  ---> Description & type of problem */}

      <View style={styles.viewTitleOrange}>
        <Text style={styles.title}>En quelques mots: 
          <TouchableOpacity onPress={toggleOverlayDescription}>
            <Ionicons name="pencil" size={18} color="#5571D7" />
          </TouchableOpacity>
        </Text>
      </View>

      <Overlay isVisible={visible} onBackdropPress={toggleOverlayDescription} backdropStyle={{opacity: 0.8, backgroundColor: '#FFF1E2'}} overlayStyle={styles.overlay}>
        <Text style={styles.title}>En quelques mots:</Text>
        <TextInput style={{backgroundColor: "white", borderRadius: 25, width: "100%"}}> </TextInput>
        <Button 
                    title='enregistrer'
                    type="solid"
                    buttonStyle={styles.buttonValider}
                    titleStyle={{
                    fontFamily: 'Montserrat_700Bold'
                    }}
                    onPress={() => handleSaveDescription()}
            /> 
      </Overlay>

      <View style={{ width: "88%"}}>
        <Text style={styles.text}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ut felis venenatis arcu dapibus efficitur at sit amet ligula. Proin cursus neque pretium enim semper, vitae feugiat nisi faucibus. </Text>
      </View>

      <View style={styles.viewTitleOrange}>
        <Text style={styles.title}>Type de problème(s): </Text>
      </View>

      <View style={styles.viewSaveDisconnect}>
        <Button 
                    title='enregistrer'
                    type="solid"
                    buttonStyle={saveButton? styles.buttonValider : styles.buttonValiderBIS}
                    titleStyle={{
                    fontFamily: 'Montserrat_700Bold'
                    }}
                    onPress={() => handleSaveChange()}
            /> 
        
        <Button 
                    title='déconnexion'
                    type="solid"
                    buttonStyle={styles.buttonDisconnect}
                    titleStyle={{
                    fontFamily: 'Montserrat_700Bold'
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
  flex : {
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: "#FFF1E2",
    alignItems: "center",
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
    marginTop: 15, 
    marginBottom: 5
  },
  viewDeleteDisable: {
    flexDirection: "row", 
    width: "100%", 
    justifyContent: "space-around",  
    marginTop: 15, 
    marginBottom: 5
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
    fontStyle: 'italic',
  },
  subtitleChanged: {
    textAlign: "center",
    color: "#BCC8F0",
    fontFamily: "Montserrat_800ExtraBold",
    fontStyle: 'italic',
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
  buttonValider: {
    backgroundColor: '#5571D7',
    borderRadius: 86,
    width: 159,
    paddingHorizontal: 10,
    paddingVertical: 3
  },
  buttonValiderBIS: {
    backgroundColor: '#BCC8F0',
    borderRadius: 86,
    width: 159,
    paddingHorizontal: 10,
    paddingVertical: 3
  },
  buttonDisconnect: {
    backgroundColor: '#D75555',
    borderRadius: 86,
    width: 159,
    paddingHorizontal: 10,
    paddingVertical: 3
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
    borderColor: "#2d3436"
  }
});