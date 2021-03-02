import React from 'react';
import {  Text, View, Button, Image } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeScreen(props) {
    return (
     
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor:'white'}}>
        <Text>HOME</Text>
        <Image
              source={require('../assets/Logo.png')}
            />
      </View>
 
    );
   }

export default HomeScreen;