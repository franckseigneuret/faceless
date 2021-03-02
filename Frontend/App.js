import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import 'react-native-gesture-handler';
//REDUX
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import user from './reducers/user.reducer';
//COMPONENTS
import Quizz from './components/Quizz'
import OptionalQuizz from './components/OptionalQuizz'
import Registration from './components/Registration'
import MessageScreen from './screens/MessageScreen'
import HomeScreen from './screens/HomeScreen'
import ProfilScreen from './screens/ProfilScreen'
// NAVIGATION
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const store = createStore(combineReducers({ user }))

const BottomNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route })=> ({
        tabBarLabel: () => { return null},
        tabBarIcon: ({ color, focused }) => {
          let iconName;

          if(route.name == 'HomeScreen') {
            if (focused) {
              return <Image style={{width: 60, height: 50}} source={{uri: 'https://i.imgur.com/ZZ1OGjy.png'}} />
            } else {
              return <Image style={{width: 60, height: 50}} source={{uri: 'https://i.imgur.com/ISNBhdh.png'}} />
            }
          } else if (route.name == 'MessageScreen') {
            iconName= 'chatbubbles';
            return <Ionicons name={iconName} size={30} color={color} />;
          } else if (route.name == 'ProfilScreen') {
            iconName= 'person-circle-sharp';
            return <Ionicons name={iconName} size={30} color={color} />;
          }
        }
      })}
      tabBarOptions={{
        activeTintColor: '#5571D7',
        inactiveTintColor: '#BCC8F0',
        style: {
          backgroundColor: '#FFF6EF',
          height: 60,
        }
      }}>
        <Tab.Screen name='ProfilScreen' component={ProfilScreen} />
        <Tab.Screen name='HomeScreen' component={HomeScreen} />
        <Tab.Screen name='MessageScreen' component={MessageScreen} />
      </Tab.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name='BottomNavigator' component={BottomNavigator} />
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