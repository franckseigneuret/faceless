import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

//REDUX
import {Provider} from 'react-redux';
import {createStore, combineReducers}  from 'redux';
import user from './reducers/user.reducer';
//COMPONENTS
import Quizz from './components/Quizz'
import OptionalQuizz from './components/OptionalQuizz'
import Registration from './components/Registration'

// NAVIGATION
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const store = createStore(combineReducers({user}))

export default function App() {
  return (
    <Provider store={store}>
    <NavigationContainer>
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Registration" component={Registration} />
      <Stack.Screen name="Quizz" component={Quizz} />
      <Stack.Screen name="OptionalQuizz" component={OptionalQuizz} />
    </Stack.Navigator>
  </NavigationContainer>
  </Provider>
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