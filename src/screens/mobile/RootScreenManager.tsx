


import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import TopAppBar from "../../components/widgets/topAppBar";
import BotAppBar from "../../components/widgets/botAppBar";

import { navigationRef } from "./RootNavigation";
import { HomeScreen } from './homeScreen';
import { WeatherScreen, WeatherTopAppBar } from './weatherScreen';
import { TablesScreen, TablesTopAppBar } from './tablesScreen';
import { ConvertorScreen, ConvertorTopAppBar } from './convertorScreen';
import { ShotInfoScreen, ShotInfoTopAppBar } from './shotInfoScreen';


const Stack = createNativeStackNavigator();





export default function RootScreenManager({ ...props }) {

    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                    header: (props) => <TopAppBar {...props} />
                    // headerShown: false, 
                }}
            >

                <Stack.Screen name="Home" component={HomeScreen} options={{header: (props) => <TopAppBar {...props} />}} />
                <Stack.Screen name="Weather" component={WeatherScreen} options={{header: (props) => <WeatherTopAppBar {...props} />}} />
                <Stack.Screen name="Table" component={TablesScreen} options={{header: (props) => <TablesTopAppBar {...props} />}} />
                <Stack.Screen name="Convertor" component={ConvertorScreen} options={{header: (props) => <ConvertorTopAppBar {...props} />}} />
                
                <Stack.Screen name="ShotInfo" component={ShotInfoScreen} options={{header: (props) => <ShotInfoTopAppBar {...props} />}} />
                
            </Stack.Navigator>
            <BotAppBar />
        </NavigationContainer>
    );
}