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
    const [currentMsg, setCurrentMsg] = useState("")
    const [myContactId, setMyContactId] = useState("")
    const [pseudo, setPseudo] = useState("")
    const [avatar, setAvatar] = useState("https://i.imgur.com/P3rBF8E.png")
    const scrollViewRef = useRef();

    // console.log("props.route.params.convId", props.route.params.convId)


    async function loadMsg() {
        var rawResponse = await fetch(`${HTTP_IP_DEV}/show-convers?convId=${props.route.params.convId}&myContactId=${props.route.params.myContactId}`, {method: 'GET'});
        var response = await rawResponse.json();
        setData(response.allMessagesWithOneUser)
        setPseudo(response.pseudo)
        setAvatar(response.avatar)
        setMyContactId(props.route.params.myContactId)
    }

    useEffect(  () => {
        loadMsg()
    }, [props.route.params.convId])

    var sendMsg =  async () => {
        await fetch(`${HTTP_IP_DEV}/send-msg`, {
            method: 'POST',
            headers: {'Content-Type':'application/x-www-form-urlencoded'},
            body: `msg=${currentMsg}&myContactId=${myContactId}`
        });
        setCurrentMsg("")
        loadMsg()
    }

    var tabMsg = data.map((item, i)=>{
        let when = new Date(item.date)
        let whenFormat = when.toLocaleDateString('fr-FR', { weekday: 'short', month: 'short', day: 'numeric' })
        + ' à ' + when.toLocaleTimeString('fr-FR')
        if(item.to_id === myContactId){
            return <View style={styles.blocRight} key={i}>
                        <View style={styles.msgRight}>
                            <Text style={styles.date} >{whenFormat}</Text>
                            <Text style={styles.textRight} >{item.content}</Text>
                        </View>
                    </View>
        } else {
            return <View style={styles.blocLeft} key={i}>
                        <View style={styles.msgLeft}>
                            <Text style={styles.date} >{whenFormat}</Text>
                            <Text style={styles.textLeft} >{item.content}</Text>
                        </View>
                    </View>
        }
    })

    return (

        <View style={{ flex: 1, alignItems: 'center',justifyContent: "space-between", backgroundColor: '#FFEEDD', paddingTop: 20, height: "100%"}}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.button} onPress={() => props.navigation.navigate('MessageScreen')}>
                <Ionicons name="chevron-back" size={30} color="#5571D7" style={{alignSelf: 'center', marginTop: 3}}/>
                </TouchableOpacity>
                <View style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <Image source={{uri: avatar}} style={{borderWidth:3, borderRadius:50, borderColor:'#EC9A1F', width: 75, height: 75}}/>
                    <Text style={styles.pseudo}>{pseudo}</Text>
                </View>
                <TouchableOpacity style={styles.button}>
                <Ionicons name="search" size={30} color="#5571D7" style={{alignSelf: 'center', marginTop: 3}}/>
                </TouchableOpacity>
            </View>
            <ScrollView style={{flex:1, width: "90%"}} showsVerticalScrollIndicator={false} 
                onMomentumScrollEnd ={()=> loadMsg()}
                ref={scrollViewRef}
                onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
                >
                {tabMsg}
            </ScrollView>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{width: "80%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                <Input
              containerStyle = {{marginBottom: 5, borderWidth: 2,minHeight: 40, maxHeight: 100,  borderColor: "#8C8C8C", borderRadius: 20, backgroundColor: "white" }}
              placeholder='Your message'
              inputContainerStyle={{borderBottomWidth:0}}
              multiline={true}
              value={currentMsg}
              onChangeText={(val) => setCurrentMsg(val)}
            />
            <TouchableOpacity style={styles.buttonSend} onPress={()=> sendMsg()}>
                <Ionicons name="send" size={25} color="#FFEEDD" style={styles.sendButton}/>
            </TouchableOpacity>
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
    //   fontFamily: "Montserrat_400Regular",
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
        // fontFamily: "Montserrat_400Regular",
      },
      buttonSend:{
        backgroundColor: "#5571D7",
        padding: 10,
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
        marginLeft: 10
      },
      sendButton: {
        alignSelf: 'center',
        marginLeft:3,
        marginBottom:5,
        transform: [{rotate:'-45deg'}]
      },
      date: {
        color: 'red',
        textAlign: 'right'
      }
    })