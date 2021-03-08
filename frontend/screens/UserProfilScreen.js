import React, { useState } from 'react';
import { StyleSheet, View, Dimensions, Image, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {useFonts, Montserrat_400Regular, Montserrat_700Bold, Montserrat_900Black, Montserrat_800ExtraBold} from "@expo-google-fonts/montserrat";
import { Button } from 'react-native-elements'
import moment from "moment";
import 'moment/locale/fr'
import AppLoading from 'expo-app-loading';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function UserProfilScreen(props) {

   const handleClickBack = () => {
       props.navigation.goBack()
   };
     
    moment.locale('fr');
    var NewDate = moment(props.route.params.subscriptionDate).format('Do MMMM YYYY')

var imageGender = ''
  if (props.route.params.gender == 'male'){
    imageGender = <Image source={require('../assets/gender_male.png')} style={{width: 40, height: 40}}/>
  } else if (props.route.params.gender == 'female') {
    imageGender = <Image source={require('../assets/gender_female.png')} style={{width: 40, height: 40}}/>
  } else if (props.route.params.gender == 'other'){
    imageGender = <Image source={require('../assets/gender_1.png')} style={{width: 40, height: 40}}/>
  }


//    const handleWarning = async () => {
//     var rawResponse = await fetch(`${HTTP_IP_DEV}/signalement-user`, {
//         method: 'POST',
//         headers: {'Content-Type':'application/x-www-form-urlencoded'},
//         body: `myContactId=${contactId}&myId=${"603f7b5163ca3a5cbd0a4746"}`
//       });
//    }

var badge = []
for (let i=0; i<props.route.params.problems_types.length; i++){
  badge.push(<Button
    buttonStyle={styles.badge}
    titleStyle={styles.fontBadge}
    title={props.route.params.problems_types[i]}
  />
  )
}

    let [fontsLoaded] = useFonts({
        Montserrat_400Regular,
        Montserrat_700Bold,
        Montserrat_900Black,
        Montserrat_800ExtraBold,
    
      });    


    if (!fontsLoaded){
      return <AppLoading />;
    } else {
    return (
        <View style={styles.profilContainer}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.buttonPrevious} onPress={() => handleClickBack()} >
                        <Ionicons name="chevron-back" size={25} color="#5571D7" style={{ alignSelf: 'center', marginTop: 3 }} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonWarning} onPress={() => handleClickBack()} >
                        <Text style={styles.textInfo}>!</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.topProfil}>
                    <Image source={{uri: props.route.params.avatar}} style={{borderWidth:3, borderRadius:50, borderColor:'#EC9A1F', width:100, height:100}}/>
                        <View style={{display: 'flex', flexDirection: 'row'}}>
                            <Text style={styles.pseudoUser}>{props.route.params.pseudo}</Text>
                            {imageGender}
                        </View>
                    <Text style={styles.memberSince}>Membre depuis le {NewDate}</Text>
                </View>
            <View style={styles.problemDesc}>
                <Text style={styles.subtitleDesc}>En quelques mots:</Text>
                <View style={{ marginTop: 15,}}>
                    <Text style={{ color: "#264653", fontFamily: "Montserrat_400Regular",}}>
                    {props.route.params.problemDesc}
                    </Text>
                </View>
            </View>
            <View style={styles.problemBadge}>
                <Text style={styles.subtitleDesc}>Type(s) de problème(s)</Text>
                <View style={styles.badgeList}>
                {badge}
                </View>
            </View>
        </View>
    )

}
}



export default UserProfilScreen;

const styles = StyleSheet.create({
    profilContainer: {
        flex: 1,
        backgroundColor: '#FFF1E2',
        width: windowWidth,
        height: windowHeight,
        display: "flex",
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 40,
    }, 
    buttonContainer: {
        width: '80%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },  
    buttonPrevious: {
        backgroundColor: "#FFEEDD",
        padding: 10,
        width: 50,
        height: 50,
        borderRadius: 30,
        borderColor: '#5571D7',
        shadowColor: "black",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.5
      },
      topProfil: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
      },    
      pseudoUser: {
        textAlign: "center",
        fontSize:20,
        color: "#5571D7",
        fontFamily: "Montserrat_700Bold",
        marginTop: 8,
        marginBottom: 8,
      },
      memberSince: {
        textAlign: "center",
        color: "#909090",
        fontFamily: "Montserrat_700Bold",
        fontStyle: 'italic',
        marginTop: 5
      },
      subtitleDesc: {
        color: "#EC9A1F",
        fontSize:20,
        fontFamily: "Montserrat_700Bold",
    },
      textDesc:{
        fontFamily: "Montserrat_400Regular",
        fontSize: 18,
        padding: 10,
      },
      problemDesc:{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: '80%',
        marginBottom: 30,
      },
      badge : {
        backgroundColor:'#5571D7',
        margin:3,
        fontSize:15,
        height:35,
        justifyContent:'center',
        alignContent:'center',
        borderRadius: 30,
      },
      fontBadge: {
        color:'white',
        fontFamily: "Montserrat_700Bold",
        marginHorizontal:5,
        fontSize:14,
        textAlign:'center',
        textAlignVertical:'center'
            },
      problemBadge:{
        width:'80%',
        display:'flex',
        flexDirection:'column',
        justifyContent:'flex-start',
        flexWrap:'wrap'
      },
      badgeList: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 15,
      },
      textInfo: {
        fontFamily: 'Montserrat_800ExtraBold',
        fontSize: 20,
        color: "#5571D7",
      },
      buttonWarning: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        borderColor: '#5571D7',
        shadowColor: "black",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.5,
        backgroundColor: "#FFEEDD",
        padding: 10,
        width: 50,
        height: 50,
      },
      badgeGood :{
        backgroundColor: 'black'
      }
})