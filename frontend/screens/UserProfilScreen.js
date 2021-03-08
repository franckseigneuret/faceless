import React, { useState } from 'react';
import { StyleSheet, View, Dimensions, Image, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {useFonts, Montserrat_400Regular, Montserrat_700Bold, Montserrat_900Black, Montserrat_800ExtraBold} from "@expo-google-fonts/montserrat";
import { useLinkProps } from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function UserProfilScreen(props) {

   const handleClickBack = () => {
       props.navigation.navigate('HomeScreen')
   };

//    const handleWarning = async () => {
//     var rawResponse = await fetch(`${HTTP_IP_DEV}/signalement-user`, {
//         method: 'POST',
//         headers: {'Content-Type':'application/x-www-form-urlencoded'},
//         body: `myContactId=${contactId}&myId=${"603f7b5163ca3a5cbd0a4746"}`
//       });
//    }
 
    let [fontsLoaded] = useFonts({
        Montserrat_400Regular,
        Montserrat_700Bold,
        Montserrat_900Black,
        Montserrat_800ExtraBold,
    
      });    

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
                    <Image source={{uri: 'https://i.imgur.com/Xqf1Ilk.png'}} style={{borderWidth:3, borderRadius:50, borderColor:'#EC9A1F', width:100, height:100}}/>
                        <View style={{display: 'flex', flexDirection: 'row'}}>
                            <Text style={styles.pseudoUser}>Jean-Michel</Text>
                            <Image source={require('../assets/gender_1.png')} style={{width: 40, height: 40}}/>
                        </View>
                    <Text style={styles.memberSince}>Membre depuis le 12 février 2021</Text>
                </View>
            <View style={styles.problemDesc}>
                <Text style={styles.subtitleDesc}>En quelques mots:</Text>
                <ScrollView style={{height: windowHeight/6, borderRadius: 15, backgroundColor: '#FFE5CA', marginTop: 15,}}>
                    <Text style={styles.textDesc}>
                    Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis les années 1500, quand un imprimeur anonyme assembla ensemble des morceaux de texte pour réaliser un livre spécimen de polices de texte. Il n'a pas fait que survivre cinq siècles, mais s'est aussi adapté à la bureautique informatique, sans que son contenu n'en soit modifié. Il a été popularisé dans les années 1960 grâce à la vente de feuilles Letraset contenant des passages du Lorem Ipsum, et, plus récemment, par son inclusion dans des applications de mise en page de texte, comme Aldus PageMaker.
                    </Text>
                </ScrollView>
            </View>
            <View style={styles.problemBadge}>
                <Text style={styles.subtitleDesc}>Type(s) de problème(s)</Text>
                <View style={styles.badgeList}>
                    <View style={styles.badge}><Text style={styles.fontBadge}>Familial</Text></View>
                    <View style={styles.badge}><Text style={styles.fontBadge}>Amoureux</Text></View>
                    <View style={styles.badge}><Text style={styles.fontBadge}>Scolaire</Text></View>
                </View>
            </View>
        </View>
    )

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
        margin:2,
        fontSize:10,
        borderRadius: 30,
      },
      fontBadge: {
        color:'white',
        marginHorizontal:15,
        marginVertical:5,
        fontFamily: "Montserrat_700Bold",
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
      } 
})