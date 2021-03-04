import React, {useEffect, useState} from 'react';
import { Text, View, Dimensions, TouchableOpacity, StyleSheet, Image,  } from 'react-native';
import { Button } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons'; 
import {useFonts, Montserrat_400Regular, Montserrat_700Bold, Montserrat_900Black, Montserrat_800ExtraBold} from "@expo-google-fonts/montserrat";
import HomeScreen from '../screens/HomeScreen'
import AppLoading from 'expo-app-loading';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import AsyncStorage from '@react-native-async-storage/async-storage';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function Filter(props) {

    useEffect(() => {
        const handleData = async () => {
          AsyncStorage.getItem("filter", function(error, data) {
            console.log(JSON.parse(data),'<------<-------<------<----- filter on store')
        });
           };
           handleData()
        }, []);

  const problemsContent = [
    {
      name: 'Amoureux',
      icon: 'heart',
    },
    {
      name: 'Familial',
      icon: 'people-sharp',
    },
    {
      name: 'Physique',
      icon: 'body',
    },
    {
      name: 'Professionnel',
      icon: 'briefcase',
    },
    {
      name: 'Scolaire',
      icon: 'school',
    },
  ]

    let [fontsLoaded] = useFonts({
        Montserrat_400Regular,
        Montserrat_700Bold,
        Montserrat_900Black,
        Montserrat_800ExtraBold,
    
      });
      
    const [isSelected, setIsSelected] = useState(-1)
    const [gender, setGender] = useState("")
    const [ageMin, setAgeMin] = useState(15)
    const [ageMax, setAgeMax] = useState(17)

    var updateGender = (index) => {
      if(index === 0){
        setGender("other")
      } else if (index === 1){
        setGender("male")
      } else if(index === 2){
        setGender("female")
      }
    }

    const handleClickBack = () => {
        props.navigation.navigate('BottomNavigator', { screen: 'HomeScreen' })
    }
    const handleSelectProblems = (arg) => {
        setIsSelected(arg)
        updateGender(key)
    }

    var problemsBadge = problemsContent.map(e => {
        return <View style={styles.badge}><Text style={styles.fontBadge}>{e.name}</Text></View>
    }) 

    var images = [
        {unSelected: <Image source={require('../assets/gender_1.png')}/>, selected: <Image source={require('../assets/gender_1_selected.png')}/>},
        {unSelected: <Image source={require('../assets/gender_male.png')}/>, selected: <Image source={require('../assets/gender_male_selected.png')}/>},
        {unSelected: <Image source={require('../assets/gender_female.png')}/>, selected: <Image source={require('../assets/gender_female_selected.png')}/>},
      ];

    var genderImages = images.map((img, key) => {
      return <TouchableOpacity key={key} onPress={() => {handleSelectProblems(key)}}>
          {isSelected === key ? img.selected : img.unSelected}
     </TouchableOpacity>
    })

 
    if (!fontsLoaded) {
        return <AppLoading />;
      } else {
  return (

    <View style={styles.container}>
      <View style={styles.topContainer}>
          <TouchableOpacity style={styles.buttonPrevious} onPress={()=> handleClickBack() } >
            <Ionicons name="chevron-back" size={25} color="#5571D7" style={{alignSelf: 'center', marginTop: 3}}/>
          </TouchableOpacity>
          <Text style={styles.textTitle}>Mes filtres</Text>
      </View>
      <View style={styles.problemsSelect}>
        <Text style={styles.titleProblems}>J'aimerais parler de...</Text>
        <View style={styles.badgeContainer}>{problemsBadge}</View>
      </View>
    <View style={styles.bottomContainer}>
        <Text style={styles.titleProblems}>Je veux parler avec :</Text>
        <View style={styles.genderContainer}>{genderImages}</View>
        <Text style={styles.titleProblems}>Age :</Text>
        <MultiSlider
        selectedStyle={styles.selectedStyle}
        unselectedStyle={styles.unselectedStyle}
        style={styles.sliderLabel}
        customeLabelStyle={styles.trackStyle}
        markerStyle={styles.markerStyle}
        // pressedMarkerStyle={MultiSliderStyles.markerStyle}
        min={18}
        max={100}
        values={[18, 100]}
        enableLabel
        enabledTwo
    
        // onValuesChangeStart={onValuesChangeStartCallback}
        // onValuesChangeFinish={onValuesChangeFinishCallback}
        // allowOverlap={false}	
        // minMarkerOverlapDistance={
        //   SLIDER_LENGTH / (quotationBounds.max - quotationBounds.min)
        // }
      />
        <Text style={styles.titleProblems}>Distance :</Text>
        <MultiSlider
        selectedStyle={styles.selectedStyle}
        unselectedStyle={styles.unselectedStyle}

        // trackStyle={MultiSliderStyles.trackStyle}
        markerStyle={styles.markerStyle}
        // pressedMarkerStyle={MultiSliderStyles.markerStyle}
        min={18}
        max={100}
        values={[18]}
        enabledTwo
        pressedMarkerStyle={styles.stepLabelStyle}
        // onValuesChangeStart={onValuesChangeStartCallback}
        // onValuesChangeFinish={onValuesChangeFinishCallback}
        allowOverlap={false}	
        // minMarkerOverlapDistance={
        //   SLIDER_LENGTH / (quotationBounds.max - quotationBounds.min)
        // }
      />
      <Text>95km</Text>
        <Button 
              title="enregistrer"
              type="solid"
              buttonStyle={styles.buttonSave}
              titleStyle={{
                fontFamily: 'Montserrat_700Bold'
              }}
            //   onPress={() => props.navigation.navigate('Quizz')}
              /> 
    </View>
    </View>

  );}
}

export default Filter;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'space-around', 
        backgroundColor: '#FFF1E2',
        width: windowWidth,
        height: windowHeight,
    },
    topContainer: {
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent:'flex-start',
        marginTop: 40,
        marginBottom:20, 
        width: '85%', 
        },
    buttonPrevious: {
        backgroundColor: "#FFEEDD",
        padding: 10,
        width: 50,
        height: 50,
        borderRadius: 30,
        borderColor:'#5571D7',
        shadowColor: "black",
        shadowOffset: {width: 1, height:1},
        shadowOpacity: 0.5
    },
    textTitle: {
        fontFamily: 'Montserrat_800ExtraBold', 
        fontWeight: "900", 
        fontSize: 26, 
        lineHeight: 32,
        color: '#5571D7',
        left: '95%',
    },
    problemsSelect: {

    },
    badge : {
        backgroundColor:'#BCC8F0',
        margin:2,
        fontSize:10,
        borderRadius: 30,
        marginVertical: 5,
        marginHorizontal: 3,
      },
      badgeBis : {
        backgroundColor:'#5571D7',
        margin:2,
        fontSize:10,
        borderRadius: 30,
        marginVertical: 5,
      },
      fontBadge: {
        color:'white',
        marginHorizontal:15,
        marginVertical:5,
        fontFamily: "Montserrat_700Bold",
        fontSize: 16,
      },
      badgeContainer:{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'flex-start',
          width: '85%'
      },
      titleProblems: {
          fontFamily: 'Montserrat_800ExtraBold',
          fontSize: 22,
          color: '#5571D7'
      },
      bottomContainer: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
      },
      genderContainer: {
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center'
      },
      buttonSave: {
        backgroundColor: '#5571D7',
        borderRadius: 86,
        width: 159,
        marginTop: 50,
        marginLeft: 60   
      },
      markerStyle:{
          backgroundColor: '#EC9A1F',
          borderWidth: 0,
          width: 30,
          height:30
      },
      selectedStyle :{
          height: 4,
          backgroundColor: '#5571D7'
      },
      unselectedStyle:{
          backgroundColor: '#BCC8F0'
      },
      sliderLabel: {
        bottom: 0,
        minWidth: 10,
        padding: 8,
        backgroundColor: 'red',
      },
      trackStyle:{
        backgroundColor: 'red'
      }
})