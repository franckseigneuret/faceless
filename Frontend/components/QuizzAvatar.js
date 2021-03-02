import React, { useState } from 'react';
import { StyleSheet, View, Dimensions, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

import BlueButton from './BlueButton';

import {
    useFonts,
    Montserrat_700Bold,
    Montserrat_900Black,
    Montserrat_800ExtraBold,
  } from "@expo-google-fonts/montserrat";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function QuizzAvatar(props) {

    const [imgAvatarSelected, setImgAvatarSelected] = useState(require('../assets/avatar_flou.png'))
    const [imgAvatarUrl, setImgAvatarUrl] = useState("")
    
    var handleClick = () => {
        props.handleClickParent("avatar", imgAvatarUrl);
    }

    var changeAvatar = (index) => {
        setImgAvatarSelected(imgAvatarSrc[index].src)
    }

    var imgAvatarSrc = [
        {src: require('../assets/women_1.png'), url: '../assets/women_1.png'},
        {src: require('../assets/women_2.png'), url: '../assets/women_2.png'},
        {src: require('../assets/women_3.png'), url: '../assets/women_3.png'},
        {src: require('../assets/women_4.png'), url: '../assets/women_4.png'},
        {src: require('../assets/women_5.png'), url: '../assets/women_5.png'},
        {src: require('../assets/women_6.png'), url: '../assets/women_6.png'},
        {src: require('../assets/women_7.png'), url: '../assets/women_7.png'},
        {src: require('../assets/women_8.png'), url: '../assets/women_8.png'}
    ]

    var imgAvatar = imgAvatarSrc.map((url, key) => {
        return <TouchableOpacity key={key} url={url} onPress={() => {changeAvatar(key), setImgAvatarUrl(url.url)}}>
                    <Image source={url.src} style={{margin: 7}}/>
                </TouchableOpacity>
    })

    let [fontsLoaded] = useFonts({
        Montserrat_700Bold,
        Montserrat_900Black,
        Montserrat_800ExtraBold,
      });

    return(
        <View style={styles.container} >
            <View style={{flex: 1, display: "flex", justifyContent: "center", alignItems: "center"}}>
                <Image source={imgAvatarSelected} style={{width: 200, height: 200 }}/>
            </View>
            <View style={styles.avatar}>
                <Ionicons name="chevron-back-outline" size={40} color="#5571D7" />
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    {imgAvatar}
                </ScrollView>
                <Ionicons name="chevron-forward-outline" size={40} color="#5571D7" />
            </View>
            <BlueButton btnTitle="enregistrer" handleClickParent={handleClick}/>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF1E2', 
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
    avatar: {
        display: "flex",
        flexDirection: "row", 
        justifyContent: "center", 
        alignItems: "center"
    }
});