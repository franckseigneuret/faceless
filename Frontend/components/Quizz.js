import React, { useState} from 'react';
import { Input } from 'react-native-elements';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import { Ionicons } from '@expo/vector-icons'; 
import AppLoading from 'expo-app-loading';
import DateTimePicker from '@react-native-community/datetimepicker';



import {
    useFonts,
    Montserrat_700Bold,
    Montserrat_900Black,
    Montserrat_800ExtraBold,
  } from "@expo-google-fonts/montserrat";

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

export default function quizz(props) {

  

    let [fontsLoaded] = useFonts({
        Montserrat_700Bold,
        Montserrat_900Black,
        Montserrat_800ExtraBold,
      });

    const problemsContent = [
      {
        name: 'Amoureux',
        icon: 'heart',
        selected: false,
      },
      {
        name: 'Familial',
        icon: 'people-sharp',
        selected: false,
      },
      {
        name: 'Physique',
        icon: 'body',
        selected: false,
      },
      {
        name: 'Professionnel',
        icon:'briefcase',
        selected: false,
      },
      {
        name: 'Scolaire',
        icon:'school',
        selected: false,
      },
    ]
        
    const [problemBadge, setProblemBadge] = useState([])

    const [visible, setVisible]= useState(false)

    const [showDate, setShowDate] = useState(false);
    const [birthDate, setBirthDate] = useState(new Date())
    const [dateToDisplay, setDateToDisplay] = useState('JJ/MM/AAAA')

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate ;
        // setShow(Platform.OS === 'ios')
        var day = currentDate.getDate()
        if (day < 10) {
            day = `0${currentDate.getDate()}`
        }
        var month = (currentDate.getMonth()+1)
        if(month< 10) {
            month= `0${currentDate.getMonth()+1}`
        }
        var year = currentDate.getFullYear().toString()
        var dateDisplay = `${day}/${month}/${year}`
        setDateToDisplay(dateDisplay)
        setBirthDate(currentDate);
        console.log(birthDate)
      };

    const handlePressTypes = () => {
        setVisible(!visible)
    }
    
    const handlePressProblem = (arg) => {
       problemsContent[arg].selected = false ? problemsContent[arg].selected = true : problemsContent[arg].selected = false;
    } 

    const handleSubmit = () => {
        props.navigation.navigate('optionalQuizz')
        console.log('click')
    }

    
    
    const handlePressDateBirth = () => {
        setShowDate(!showDate)
    }
    
    var allProblems = problemsContent.map((item, i) => (
        <TouchableOpacity key={i} style={item.selected ? styles.problemCardBis : styles.problemCard} onPress={handlePressProblem(i)}>
            <Ionicons name={item.icon} size={24} color="#5571D7" />
            <Text style={styles.textProblem}>{item.name}</Text>
        </TouchableOpacity>  
        ))
        
        const [problemsList, setProblemsList] = useState(allProblems);
  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
  return (
<View style={styles.container}>
      <View style={{flex: 1, display:'flex', flexDirection:'column', justifyContent:'flex-end'}}>
        <ProgressSteps 
        completedStepIconColor='#5571D7' 
        progressBarColor='#BCC8F0' 
        completedProgressBarColor='#5571D7'
        activeStepIconColor='#5571D7'
        activeStepIconBorderColor='#BCC8F0'
        disabledStepNumColor='#BCC8F0'
        disabledStepIconColor='#BCC8F0'
        completedStepNumColor='#5571D7'
        activeStepNumColor='#5571D7'
        completedCheckColor='#5571D7'
        topOffset={windowHeight -100}
        >
            <ProgressStep nextBtnText='valider'
                nextBtnStyle={styles.buttonNext} 
                nextBtnTextStyle={styles.buttonNextText}
             >  
                <View style={styles.stepContainer}>
                    <Text style={styles.textTitleQuizz}>Salut,</Text>
                    <Text style={styles.textQuizz}>C'est quoi ton email ?</Text>
                    <Input
                      placeholder='helicoptere530@gmail.com'
                      inputContainerStyle={styles.inputQuizz}
                    />  
                </View>
            </ProgressStep>
            <ProgressStep 
                nextBtnStyle={styles.buttonNext} 
                nextBtnTextStyle={styles.buttonNextText} 
                nextBtnText='valider' 
                previousBtnTextStyle={styles.buttonPreviousText}
                previousBtnText='Revoir'
                previousBtnStyle={styles.buttonPrevious}>
                <View style={styles.stepContainer}> 
                    <Text style={styles.textQuizz}>Créé ton mot de passe</Text>
                    <Input
                      placeholder='*****'
                      inputContainerStyle={styles.inputQuizz}
                    />
                </View>
            </ProgressStep>
            <ProgressStep 
                nextBtnStyle={styles.buttonNext} 
                nextBtnTextStyle={styles.buttonNextText} 
                nextBtnText='valider' 
                previousBtnTextStyle={styles.buttonPreviousText}
                previousBtnText='Revoir'
                previousBtnStyle={styles.buttonPrevious}>
                <View style={styles.stepContainer}>
                    <Text style={styles.textQuizz}>Comment veux-tu qu'on t'appelle ?</Text>
                    <Input
                      placeholder='ThermomixMT1820'
                      inputContainerStyle={styles.inputQuizz}
                    />  
                </View>
            </ProgressStep>
            <ProgressStep 
                nextBtnStyle={styles.buttonNext} 
                nextBtnTextStyle={styles.buttonNextText} 
                nextBtnText='valider' 
                previousBtnTextStyle={styles.buttonPreviousText}
                previousBtnText='Revoir'
                previousBtnStyle={styles.buttonPrevious}>
                <View style={styles.stepContainer}>
                    <Text style={styles.textQuizz}>C'est quoi ta date de naissance ?</Text>
                    <TouchableOpacity
                      style={styles.buttonDate}
                      onPress={handlePressDateBirth}
                    >
                        <Text style={styles.birthDate}>{dateToDisplay}   <Ionicons name="calendar" size={18} color="black" /></Text>
                    </TouchableOpacity>
                </View>
                <View style={{width: '100%', bottom: 100}}>
                {showDate ? <DateTimePicker 
                                testID="dateTimePicker" 
                                value={birthDate} mode='date' 
                                is24Hour={true} 
                                display="spinner" 
                                style={{width: '100%'}}
                                onChange={onChange} />: <Text></Text>}
                </View>
            </ProgressStep>
            <ProgressStep 
                nextBtnStyle={styles.buttonNext} 
                nextBtnTextStyle={styles.buttonNextText} 
                nextBtnText='valider' 
                previousBtnTextStyle={styles.buttonPreviousText}
                previousBtnText='Revoir'
                previousBtnStyle={styles.buttonPrevious}
                onSubmit={handleSubmit}>
                <View style={styles.stepContainer}>
                    <Text style={styles.textQuizz}>Sélectionne ton ou tes problème(s)</Text>
                    <TouchableOpacity
                      style={styles.buttonProblems}
                      onPress={handlePressTypes}
                    >
                        <Text style={styles.textButtonProblems}>Types de problèmes<Ionicons name="chevron-down" size={14} color="black" /></Text>
                    </TouchableOpacity>
                      {visible ? problemsList : <Text></Text>}
                </View>
            </ProgressStep>
        </ProgressSteps>
    </View>
</View>
  );}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF1E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonNext: {
    backgroundColor: '#5571D7',
    width: 130,
    borderRadius: 86,   
    marginBottom: 25,
    bottom: 70,
  },
  buttonPrevious: {
    // borderWidth: 1,
    // borderColor: 'black',
    bottom: 95,

  },
  buttonPreviousText: {
    color: '#EC9A1F',
    width: 'auto',
    fontFamily: 'Montserrat_700Bold',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 1,
    marginHorizontal: 20
  },  
  buttonNextText: {
      color: '#FFF1E2',
      fontFamily: 'Montserrat_700Bold',
      fontSize: 18,
      textAlign: 'center',
  },
  inputQuizz: {
      borderColor: 'black',
      right:10
  },
  textTitleQuizz: {
    color: '#5571D7',
    fontFamily: 'Montserrat_900Black',
    fontSize: 56,
  },
  textQuizz: {
    color: '#5571D7',
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 22,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonProblems: {
    alignItems: "center",
    backgroundColor: "#FFCC99",
    padding: 10,
    width: '100%',
    borderWidth: 1,
    borderRadius: 5,
    borderColor:'black',
  },
  textButtonProblems: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
  },
  count: {
    top: windowHeight/4,
  },
  stepContainer: {
    flex: 1, 
    display:'flex', 
    flexDirection:'column',
    alignItems:'flex-start',
    justifyContent: 'center',
    width: '70%',
    height: windowHeight/2,
    left: 60,
  },
  problemCard: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width:'100%',
    padding: 4,
    backgroundColor:'#FFCC99',
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomColor: 'black',
    borderLeftColor: 'black',
    borderRightColor: 'black',
    borderRadius: 5,
  },
  textProblem: {
      fontFamily: 'Montserrat_700Bold',
      fontSize: 18,
  },
  problemCardBis: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width:'100%',
    padding: 4,
    backgroundColor:'red',
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomColor: 'black',
    borderLeftColor: 'black',
    borderRightColor: 'black',
    borderRadius: 5,
  },
  buttonDate: {
    backgroundColor: "#FFF1E2",
    padding: 10,
    width: '100%',
    borderBottomWidth: 1,
    borderRadius: 5,
    borderColor:'black',
  },
  birthDate:{
      fontFamily: 'Montserrat_700Bold',
      fontSize: 18
  }
});
