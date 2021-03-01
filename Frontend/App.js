import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';


//COMPONENTS
import quizz from './components/quizz'
import optionalQuizz from './components/optionalQuizz'
import registration from './components/registration'
// NAVIGATION
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();



export default function App() {
  return (
    <NavigationContainer>
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {/* <Stack.Screen name="Registration" component={registration} /> */}
      <Stack.Screen name="Quizz" component={quizz} />
      <Stack.Screen name="optionalQuizz" component={optionalQuizz} />
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
