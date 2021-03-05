import React, { useEffect, useState } from 'react';
import { Text, View, Dimensions, TouchableOpacity, StyleSheet, Image, } from 'react-native';
import { Button } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Montserrat_400Regular, Montserrat_700Bold, Montserrat_900Black, Montserrat_800ExtraBold } from "@expo-google-fonts/montserrat";
import HomeScreen from '../screens/HomeScreen'
import AppLoading from 'expo-app-loading';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HTTP_IP_DEV from '../mon_ip'


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function Filter(props) {



  const [ageMin, setAgeMin] = useState()
  const [ageMax, setAgeMax] = useState()
  const [localisation, setLocalisation] = useState()
  const [problems, setProblems] = useState()
  const [problemsStatut, setProblemsStatut] = useState({ Amoureux: false, Familial: false, Physique: false, Professionnel: false, Scolaire: false })
  const [genderStatut, setGenderStatut] = useState({other: true, male: true, female: true })
  const [genderSelected, setGenderSelected] = useState([])


  useEffect(() => {
    const handleData = async () => {
      AsyncStorage.getItem("filter", function (error, data) {
        var problemsArriving;
        var data = JSON.parse(data)
        setAgeMin(data.age.minAge)
        setAgeMax(data.age.maxAge)
        setLocalisation(data.localisation)
        
        setProblems(data.problemsTypes)
        if (data.problemsTypes.includes('Amoureux')){
          problemsArriving= {...problemsStatut};
          problemsArriving[`Amoureux`] = true;
          setProblemsStatut(problemsArriving)
        } else if (data.problemsTypes.includes('Familial')){
          problemsArriving= {...problemsStatut};
          problemsArriving[`Familial`] = true;
          setProblemsStatut(problemsArriving)
        } else if (data.problemsTypes.includes('Physique')){
          problemsArriving= {...problemsStatut};
          problemsArriving[`Physique`] = true;
          setProblemsStatut(problemsArriving);
        } else if (data.problemsTypes.includes('Professionnel')){
          problemsArriving= {...problemsStatut};
          problemsArriving[`Professionnel`] = true;
          setProblemsStatut(problemsArriving)
        } else if (data.problemsTypes.includes('Scolaire')){
          problemsArriving= {...problemsStatut};
          problemsArriving[`Scolaire`] = true;
          setProblemsStatut(problemsArriving);
        }
        setGenderStatut(data.gender)
        setLocalisation(data.localisation)
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

  const handleClickBack = () => {
    props.navigation.navigate('BottomNavigator', { screen: 'HomeScreen' })
  }

  const handleSelectGender = (element) => {
    var genderStatutCopy = { ...genderStatut }
    if (genderStatutCopy[element] == false) {
      genderStatutCopy[element] = true;
      setGenderStatut(genderStatutCopy);
    } else {
      genderStatutCopy[element] = false
      setGenderStatut(genderStatutCopy)
    }
  } // on fait pas de map et on execute une fonction avec en argument (male ou female ou other), on change un état d'objet

  const handleSelectProblems = (element) => {
    var problemsStatutCopy = { ...problemsStatut }
    var problemsTypesCopy = [...problems]
    if (problemsStatutCopy[element] == false && problemsTypesCopy.includes(element) == false) {
      problemsStatutCopy[element] = true;
      setProblemsStatut(problemsStatutCopy);
      problemsTypesCopy.push(element);
      setProblems(problemsTypesCopy)
      console.log(problemsTypesCopy, '<------- problems types copy')
    } else {
      problemsStatutCopy[element] = false
      setProblemsStatut(problemsStatutCopy)
      problemsTypesCopy = problemsTypesCopy.filter(e => e != element)
      setProblems(problemsTypesCopy)
      console.log(problemsTypesCopy, '<------- problems types copy')
    }
  }
  var problemsArray = []
  var genderArray = []

  const handleSaveFilter = () => {
    for (const [key, value] of Object.entries(problemsStatut)) {
      if(value == true && problemsArray.includes(key) == false)
      problemsArray.push(key)
    }
    console.log(problemsArray, '<----- problems on save')
    AsyncStorage.setItem('filter', JSON.stringify(
      {
        problemsTypes: problemsArray, 
        gender: genderStatut, 
        age: {
          minAge: ageMin, 
          maxAge: ageMax,
        },
        localisation: localisation
      }
    ));
  }
  
 
  var problemsBadge = [
    <TouchableOpacity onPress={() => { handleSelectProblems(`Amoureux`) }} style={problemsStatut['Amoureux'] == true ? styles.badgeBis : styles.badge}><Text style={styles.fontBadge}>Amoureux</Text></TouchableOpacity>,
    <TouchableOpacity onPress={() => { handleSelectProblems(`Familial`) }} style={problemsStatut['Familial'] == true ? styles.badgeBis : styles.badge}><Text style={styles.fontBadge}>Familial</Text></TouchableOpacity>,
    <TouchableOpacity onPress={() => { handleSelectProblems(`Physique`) }} style={problemsStatut['Physique'] == true ? styles.badgeBis : styles.badge}><Text style={styles.fontBadge}>Physique</Text></TouchableOpacity>,
    <TouchableOpacity onPress={() => { handleSelectProblems(`Professionnel`) }} style={problemsStatut['Professionnel'] == true ? styles.badgeBis : styles.badge}><Text style={styles.fontBadge}>Professionnel</Text></TouchableOpacity>,
    <TouchableOpacity onPress={() => { handleSelectProblems(`Scolaire`) }} style={problemsStatut['Scolaire'] == true ? styles.badgeBis : styles.badge}><Text style={styles.fontBadge}>Scolaire</Text></TouchableOpacity>
  ]

  var imagesGender = [
    { unSelected: <TouchableOpacity onPress={() => { handleSelectGender(`other`) }}><Image source={require('../assets/gender_1.png')} /></TouchableOpacity>, selected: <TouchableOpacity onPress={() => { handleSelectGender(`other`) }}><Image source={require('../assets/gender_1_selected.png')} /></TouchableOpacity> },
    { unSelected: <TouchableOpacity onPress={() => { handleSelectGender(`male`) }}><Image source={require('../assets/gender_male.png')} /></TouchableOpacity>, selected: <TouchableOpacity onPress={() => { handleSelectGender(`male`) }}><Image source={require('../assets/gender_male_selected.png')} /></TouchableOpacity> },
    { unSelected: <TouchableOpacity onPress={() => { handleSelectGender(`female`) }}><Image source={require('../assets/gender_female.png')} /></TouchableOpacity>, selected: <TouchableOpacity onPress={() => { handleSelectGender(`female`) }}><Image source={require('../assets/gender_female_selected.png')} /></TouchableOpacity> },
  ];

  // var genderImages = images.map((img, key) => {
  //   return <TouchableOpacity key={key} onPress={() => {handleSelectGender(key)}}>
  //       {gender[key] ? img.selected : img.unSelected}
  //  </TouchableOpacity>
  // })


  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (

      <View style={styles.container}>
        <View style={styles.topContainer}>
          <TouchableOpacity style={styles.buttonPrevious} onPress={() => handleClickBack()} >
            <Ionicons name="chevron-back" size={25} color="#5571D7" style={{ alignSelf: 'center', marginTop: 3 }} />
          </TouchableOpacity>
          <Text style={styles.textTitle}>Mes filtres</Text>
        </View>
        <View style={styles.problemsSelect}>
          <Text style={styles.titleProblems}>J'aimerais parler de...</Text>
          <View style={styles.badgeContainer}>
            {problemsBadge}
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <Text style={styles.titleProblems}>Je veux parler avec :</Text>
          <View style={styles.genderContainer}>
            {genderStatut.other == false ? imagesGender[0].unSelected : imagesGender[0].selected}
            {genderStatut.male == false ? imagesGender[1].unSelected : imagesGender[1].selected}
            {genderStatut.female == false ? imagesGender[2].unSelected : imagesGender[2].selected}
          </View>
          <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
            <Text style={styles.titleProblems}>Age :</Text>
            <Text style={styles.textDynamic}>min: {ageMin}</Text>
            <Text style={styles.textDynamic}>max: {ageMax}</Text>
          </View>
          <MultiSlider
            selectedStyle={styles.selectedStyle}
            unselectedStyle={styles.unselectedStyle}
            style={styles.sliderLabel}
            markerStyle={styles.markerStyle}
            min={18}
            max={100}
            values={[18, 100]}
            enabledTwo
            onValuesChangeFinish={value => { setAgeMin(value[0]); setAgeMax(value[1]) }}
          />
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <Text style={styles.titleProblems}>Distance :</Text>
            <Text style={styles.textDynamic}>{localisation == 'France' || localisation > 90 ? 'France' : `${localisation} km`}</Text>
          </View>
          <MultiSlider
            selectedStyle={styles.selectedStyle}
            unselectedStyle={styles.unselectedStyle}
            markerStyle={styles.markerStyle}
            min={18}
            max={100}
            values={[18]}
            enabledTwo
            onValuesChange={value => setLocalisation(value)}
            pressedMarkerStyle={styles.stepLabelStyle}
            allowOverlap={false}

          />

          <Button
            title="enregistrer"
            type="solid"
            buttonStyle={styles.buttonSave}
            titleStyle={{
              fontFamily: 'Montserrat_700Bold'
            }}
          //   onPress={() => props.navigation.navigate('Quizz')}
          onPress={() => handleSaveFilter()}
          />
        </View>
      </View>

    );
  }
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
    justifyContent: 'flex-start',
    marginTop: 40,
    marginBottom: 20,
    width: '85%',
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
  badge: {
    backgroundColor: '#BCC8F0',
    margin: 2,
    fontSize: 10,
    borderRadius: 30,
    marginVertical: 5,
    marginHorizontal: 3,
  },
  badgeBis: {
    backgroundColor: '#5571D7',
    margin: 2,
    fontSize: 10,
    borderRadius: 30,
    marginVertical: 5,
  },
  fontBadge: {
    color: 'white',
    marginHorizontal: 15,
    marginVertical: 5,
    fontFamily: "Montserrat_700Bold",
    fontSize: 16,
  },
  badgeContainer: {
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
  markerStyle: {
    backgroundColor: '#EC9A1F',
    borderWidth: 0,
    width: 30,
    height: 30
  },
  selectedStyle: {
    height: 4,
    backgroundColor: '#5571D7'
  },
  unselectedStyle: {
    backgroundColor: '#BCC8F0'
  },
  sliderLabel: {
    bottom: 0,
    minWidth: 10,
    padding: 8,
    backgroundColor: 'red',
  },
  trackStyle: {
    backgroundColor: 'red'
  },
  textDynamic: {
    fontFamily: 'Montserrat_700Bold',
    color: '#EC9A1F',
    fontSize: 18
  }
})