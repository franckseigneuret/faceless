import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';


//COMPONENTS
import Quizz from './components/Quizz'
import OptionalQuizz from './components/OptionalQuizz'
import Registration from './components/Registration'
import Geolocalisation from './components/Geolocalisation'
// NAVIGATION
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();



export default function App() {
  return (
    <NavigationContainer>
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {/* <Stack.Screen name="Registration" component={Registration} /> */}
      <Stack.Screen name="Geolocalisation" component={Geolocalisation} />
      <Stack.Screen name="Quizz" component={Quizz} />
      <Stack.Screen name="OptionalQuizz" component={OptionalQuizz} />
    </Stack.Navigator>
  </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF1E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
