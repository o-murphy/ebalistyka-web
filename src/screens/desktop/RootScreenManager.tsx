


import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { navigationRef } from "./RootNavigation";
import { HomeScreen } from './homeScreen';
import { BusyOverlayAnimated } from '../mobile/components';
import { Drawer as PaperDrawer, Surface, useTheme } from "react-native-paper";
import { Drawer } from 'react-native-drawer-layout';
import { useNavigation } from "@react-navigation/native"
import { StyleSheet } from 'react-native';
import { TopAppBar } from './components';
import { TablesScreen } from './tablesScreen';
import { SettingsScreen } from './settingsScreen';
import { ChartsScreen } from './chartsScreen.tsx';
import { PropertiesScreen } from './propertiesScreen.tsx';

const Stack = createNativeStackNavigator();


const navigationViewCollapsed = () => {
    const navigation = useNavigation()

    return (
        <Surface style={[styles.navigationContainer]} elevation={2}>
            <PaperDrawer.CollapsedItem focusedIcon={"home"} label={"Home"} onPress={() => navigation.navigate("Home")} />
            <PaperDrawer.CollapsedItem focusedIcon={"table"} label={"Tables"} onPress={() => navigation.navigate("Tables")} />
            <PaperDrawer.CollapsedItem focusedIcon={"chart-bell-curve-cumulative"} label={"Charts"} onPress={() => navigation.navigate("Charts")} />
            <PaperDrawer.CollapsedItem focusedIcon={"tools"} label={"Profile"} onPress={() => navigation.navigate("Profile")} />
            <PaperDrawer.CollapsedItem focusedIcon={"cog-outline"} label={"Settings"} onPress={() => navigation.navigate("Settings")} />
        </Surface>
    );
}


const RootDrawer = ({ ...props }) => {
    const theme = useTheme()

    return (
        <Drawer
            drawerType={"permanent"}
            style={{}}
            drawerPosition={"left"}
            renderDrawerContent={navigationViewCollapsed}
            drawerStyle={{ backgroundColor: theme.colors.surface, width: 80 }}
        >
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerShown: false
                }}
            >
                <Stack.Screen name="Home" component={HomeScreen} options={{}} />
                <Stack.Screen name="Tables" component={TablesScreen} options={{}} />
                <Stack.Screen name="Settings" component={SettingsScreen} options={{}} />
                <Stack.Screen name="Charts" component={ChartsScreen} options={{}} />
                <Stack.Screen name="Profile" component={PropertiesScreen} options={{}} />
            </Stack.Navigator>
        </Drawer>
    )
}


export default function RootScreenManager({ ...props }) {

    return (
        <BusyOverlayAnimated>
            <NavigationContainer ref={navigationRef}>
                <TopAppBar />
                <Surface style={{ flex: 1 }} elevation={0}>
                    <RootDrawer />
                </Surface>
            </NavigationContainer>
        </BusyOverlayAnimated>

    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: "red",
    },
    navigationContainer: {
        flex: 1,
        alignItems: "flex-start",
        justifyContent: "flex-start"
    },
    paragraph: {
        fontSize: 15,
        textAlign: 'center',
    },
});