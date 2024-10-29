


import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import TopAppBar from "../../components/widgets/topAppBar";
import BotAppBar from "../../components/widgets/botAppBar";

import { navigationRef } from "./RootNavigation";
import { HomeScreen } from './homeScreen';
import { WeatherScreen } from './weatherScreen';
import { TrajectoryTableScreen } from './trajectoryTableScreen';
import { ConvertorScreen } from './convertorScreen';


const Stack = createNativeStackNavigator();





export default function RootScreenManager({ ...props }) {

    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                    header: (props) => <TopAppBar />
                    // headerShown: false, 
                }}
            >

                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Weather" component={WeatherScreen} />
                <Stack.Screen name="Table" component={TrajectoryTableScreen} />
                <Stack.Screen name="Convertor" component={ConvertorScreen} />
                
            </Stack.Navigator>
            <BotAppBar />
        </NavigationContainer>
    );
}