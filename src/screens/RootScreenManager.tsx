


import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import TopAppBar from "../components/widgets/topAppBar";
import BotAppBar from "../components/widgets/botAppBar";

import { navigationRef } from "./RootNavigation";
import { ScrollView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { useTheme } from '../context/themeContext';
import { Text } from 'react-native-paper';
import WeaponCard from '../components/cards/weaponCard';
import CurrentAtmoCard from '../components/cards/currentAtmoCard';


const Stack = createNativeStackNavigator();


export const HomeScreen = ({ navigation }) => {
    const { theme } = useTheme();

    const styles = StyleSheet.create({
        scrollViewContainer: {
            backgroundColor: theme.colors.background,
        },
    });

    return (
        <ScrollView
            style={styles.scrollViewContainer}
            keyboardShouldPersistTaps="always"
            alwaysBounceVertical={false}
            showsVerticalScrollIndicator={true}
        >
            <WeaponCard />
            <Text variant="displayLarge">
                Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder 
                Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder 
            </Text>
        </ScrollView>
    )
}

export const ConditionsScreen = ({ navigation }) => {
    const { theme } = useTheme();

    const styles = StyleSheet.create({
        scrollViewContainer: {
            backgroundColor: theme.colors.background,
        },
    });

    return (
        <ScrollView
            style={styles.scrollViewContainer}
            keyboardShouldPersistTaps="always"
            alwaysBounceVertical={false}
            showsVerticalScrollIndicator={true}
        >
            <CurrentAtmoCard />
            <Text variant="displayLarge">
                Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder 
                Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder 
            </Text>
        </ScrollView>
    )
}

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
                <Stack.Screen name="Weather" component={ConditionsScreen} />
                
            </Stack.Navigator>
            <BotAppBar />
        </NavigationContainer>
    );
}