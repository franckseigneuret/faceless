import  HTTP_IP_DEV from '../mon_ip'
import React, {useEffect, useState, useRef} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView} from 'react-native';
import {Input} from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function ConversationScreen(props) {

    const [data, setData] = useState([])
    const [value, setValue] = useState("")
    const [myId, setMyId] = useState("")
    const [pseudo, setPseudo] = useState("")

    const test = useRef(null);

    
    useEffect(  () => {
        async function loadData() {
            var rawResponse = await fetch(`${HTTP_IP_DEV}/show-convers`);
            var response = await rawResponse.json();
            setData(response.allMessagesWithOneUser)
            setMyId(response.id)
            setPseudo(response.pseudo)
        }
        loadData()
        test.scrollToEnd({animated: true})

    }, [])

    var tabMsg = data.map((item)=>{
        if(item.from_id === myId){
            return <View style={styles.blocRight}>
                        <View style={styles.msgRight}>
                            <Text style={styles.textRight} >{item.content}</Text>
                        </View>
                    </View>
        } else {
            return <View style={styles.blocLeft}>
                        <View style={styles.msgLeft}>
                            <Text style={styles.textLeft} >{item.content}</Text>
                        </View>
                    </View>
        }
    })
    
    console.log("data", myId)

    return (

        <View style={{ flex: 1, alignItems: 'center',justifyContent: "space-between", backgroundColor: '#FFEEDD', paddingTop: 20, height: "100%"}}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.button}>
                <Ionicons name="chevron-back" size={30} color="#5571D7" style={{alignSelf: 'center', marginTop: 3}}/>
                </TouchableOpacity>
                <View>
                    <Image source={require("../assets/women_4.png")} style={{borderWidth:3, borderRadius:50, borderColor:'#EC9A1F'}}/>
                    <Text style={styles.pseudo}>{pseudo}</Text>
                </View>
                <TouchableOpacity style={styles.button}>
                <Ionicons name="search" size={30} color="#5571D7" style={{alignSelf: 'center', marginTop: 3}}/>
                </TouchableOpacity>
            </View>
            <ScrollView style={{flex:1, width: "90%"}} showsVerticalScrollIndicator={false} ref="scrollView">
            {tabMsg}
            {tabMsg}
            </ScrollView>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{width: "90%"}}>
                <Input
              containerStyle = {{marginBottom: 5, borderWidth: 2,minHeight: 30, maxHeight: 100,  borderColor: "#8C8C8C", borderRadius: 20, backgroundColor: "white" }}
              placeholder='Your message'
              inputContainerStyle={{borderBottomWidth:0}}
              multiline={true}

            //   value={currentMsg}
            //   onChangeText={(val) => setCurrentMsg(val)}
                />
            </KeyboardAvoidingView>
        </View>
  );
}

export default ConversationScreen;

const styles = StyleSheet.create({
    header: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15

    },
    button:{
      backgroundColor: "#FFF1E2",
      width: 50,
      height: 50,
      borderRadius: 30,
      borderColor:'#5571D7',
      shadowColor: "black",
      shadowOffset: {width: 1, height:1},
      shadowOpacity: 0.5,
      display: 'flex',
      justifyContent:'center',
      alignItems:'center', 
      margin: 15
    },
    pseudo :{
        textAlign: "center",
        fontSize:20,
        color: "#5571D7",
      fontFamily: "Montserrat_700Bold",
    },
    blocLeft: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        width: "100%"
    },
    msgLeft: {
        backgroundColor: "#BCC8F0",
        maxWidth: "80%",
        padding: 12,
        borderRadius: 15,
        marginBottom: 10
    },
    textLeft: {
      textAlign: "left", 
      color: "#000000", 
      fontFamily: "Montserrat_400Regular",
    },
    blocRight: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      width: "100%"
    },
    msgRight: {
        backgroundColor: "#5571D7",
        maxWidth: "80%",
        padding: 12,
        borderRadius: 15,
        marginBottom: 10
    },
    textRight: {
        textAlign: "right", 
        color: "#FFFFFF", 
        fontFamily: "Montserrat_400Regular",
      },
    })