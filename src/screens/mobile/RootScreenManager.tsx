


import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { BotAppBar } from "./components";

import { navigationRef } from "./RootNavigation";
import { HomeScreenTopAppBar, HomeScreen } from './homeScreen';
import { WeatherScreen, WeatherTopAppBar } from './weatherScrreen';
import { TablesScreen, TablesTopAppBar } from './tablesScreen';
import { ConvertorScreen, ConvertorTopAppBar } from './convertorScreen';
import { ShotInfoScreen, ShotInfoTopAppBar } from './shotInfoScreen';
import { BusyOverlayAnimated } from './busyOverlay';
import { SettingsScreen, SettingsScreenTopAppBar } from './settingsScreen';


const Stack = createNativeStackNavigator();


export default function RootScreenManager({ ...props }) {

    return (
        <BusyOverlayAnimated>
            <NavigationContainer ref={navigationRef}>
                <Stack.Navigator
                    initialRouteName="Home"
                    screenOptions={{
                        // header: (props) => <TopAppBar {...props} />
                    }}
                >

                    <Stack.Screen name="Home" component={HomeScreen} options={{ header: (props) => <HomeScreenTopAppBar {...props} /> }} />
                    <Stack.Screen name="Weather" component={WeatherScreen} options={{ header: (props) => <WeatherTopAppBar {...props} /> }} />
                    <Stack.Screen name="Table" component={TablesScreen} options={{ header: (props) => <TablesTopAppBar {...props} /> }} />
                    <Stack.Screen name="Convertor" component={ConvertorScreen} options={{ header: (props) => <ConvertorTopAppBar {...props} /> }} />

                    <Stack.Screen name="ShotInfo" component={ShotInfoScreen} options={{ header: (props) => <ShotInfoTopAppBar {...props} /> }} />

                    <Stack.Screen name="SettingsScreen" component={SettingsScreen} options={{ header: (props) => <SettingsScreenTopAppBar {...props} /> }} />

                </Stack.Navigator>
                <BotAppBar />
            </NavigationContainer>
        </BusyOverlayAnimated>

    );
}