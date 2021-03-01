import React from 'react';

import {Image,StyleSheet} from 'react-native';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import MessageScreen from './screens/MessageScreen';
import HomeScreen from './screens/HomeScreen';
import ProfilScreen from './screens/ProfilScreen';

import { Ionicons } from '@expo/vector-icons'; 

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const BottomNavigator = () => {
    return (
        <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarLabel:() => {return null},
            tabBarIcon: ({ color, focused }) => {
            let iconName;

            if (route.name == 'HomeScreen') {
                if(focused){
                    return <Image
                style={{ width: 60, height: 50,}}
                source={{
                    uri:'https://i.imgur.com/ZZ1OGjy.png',
                }}
            />
                  }else {
                    return <Image
                    style={{ width: 60, height: 50,}}
                    source={{
                        uri:'https://i.imgur.com/ISNBhdh.png',
                    }}
                />
                  }
            } else if (route.name == 'MessageScreen') {
                iconName = 'chatbubbles';
                return <Ionicons name={iconName} size={30} color={color} />;
            } else if (route.name == 'ProfilScreen') {
                iconName = 'person-circle-sharp';
                return <Ionicons name={iconName} size={30} color={color} />;
            }
            },
        })}
            
        tabBarOptions={{
            activeTintColor: '#5571D7',
            inactiveTintColor: '#BCC8F0',
            style: {
                backgroundColor: '#FFF6EF',
                height: 60,
            }
        }}
        
        >
            
            <Tab.Screen name="ProfilScreen" component={ProfilScreen} />
            <Tab.Screen name="HomeScreen" component={HomeScreen} />
            <Tab.Screen name="MessageScreen" component={MessageScreen} />
            
        </Tab.Navigator>
    );
}

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="BottomNavigator" component={BottomNavigator} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}