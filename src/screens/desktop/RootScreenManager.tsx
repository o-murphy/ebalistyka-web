


import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { navigationRef } from "./RootNavigation";
import { HomeScreen } from './homeScreen';
import { BusyOverlayAnimated } from '../mobile/busyOverlay';
import { Drawer as PaperDrawer, Surface, useTheme } from "react-native-paper";
import { Drawer } from 'react-native-drawer-layout';
import { useNavigation } from "@react-navigation/native"
import { StyleSheet } from 'react-native';
import TopAppBar from '../../components/widgets/topAppBar';
import { TablesScreen } from './tablesScreen';
import { SettingsScreen } from './settingsScreen';

const Stack = createNativeStackNavigator();


const navigationView = ({ setCollapsed }) => {
    const navigation = useNavigation()

    return (
        <Surface style={[styles.navigationContainer]} elevation={2}>
        <PaperDrawer.Item icon={"menu"} label={""} onPress={() => setCollapsed(true)} />
        <PaperDrawer.Item icon={"home"} label={"Home"} onPress={() => navigation.navigate("Home")} />
        <PaperDrawer.Item icon={"table"} label={"Tables"} onPress={() => navigation.navigate("Tables")} />
        <PaperDrawer.Item icon={"chart-bell-curve-cumulative"} label={"Charts"} onPress={() => navigation.navigate("Charts")} />
        <PaperDrawer.Item icon={"cog-outline"} label={"Settings"} onPress={() => navigation.navigate("Settings")} />
    </Surface>
    )
}

const navigationViewCollapsed = ({ setCollapsed }) => {
    const navigation = useNavigation()

    return (
        <Surface style={[styles.navigationContainer]} elevation={2}>
            <PaperDrawer.CollapsedItem focusedIcon={"menu"} label={""} onPress={() => setCollapsed(false)} />
            <PaperDrawer.CollapsedItem focusedIcon={"home"} label={"Home"} onPress={() => navigation.navigate("Home")} />
            <PaperDrawer.CollapsedItem focusedIcon={"table"} label={"Tables"} onPress={() => navigation.navigate("Tables")} />
            <PaperDrawer.CollapsedItem focusedIcon={"chart-bell-curve-cumulative"} label={"Charts"} onPress={() => navigation.navigate("Charts")} />
            <PaperDrawer.CollapsedItem focusedIcon={"cog-outline"} label={"Settings"} onPress={() => navigation.navigate("Settings")} />
        </Surface>
    );
}


const RootDrawer = ({ ...props }) => {
    const theme = useTheme()

    const [open, setOpen] = useState(true)
    const [collapsed, setCollapsed] = useState(true)

    const drawerWidth = collapsed ? 80 : 300
    const drawerType = collapsed ? "permanent" : "front"

    return (
        <Drawer
            open={open}
            drawerType={drawerType}
            onOpen={() => setOpen(true)}
            onClose={() => setCollapsed(true)}
            style={{}}
            drawerPosition={"left"}
            renderDrawerContent={() => (collapsed ? navigationViewCollapsed : navigationView)({ setCollapsed: setCollapsed })}
            drawerStyle={{ backgroundColor: theme.colors.surface, width: drawerWidth }}
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