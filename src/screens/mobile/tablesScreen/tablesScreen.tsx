import { useState } from "react";
import { View } from "react-native";
import { Appbar, Divider, IconButton, Text, useTheme } from "react-native-paper";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { useCalculator } from "../../../context/profileContext";
import { TrajectoryTable, ZerosDataTable } from "../../../components/widgets/tableView/tableView";
import { TableSettingsDialog } from "./components/tablesSettingsDialog";
import { TableSettingsProvider, useTableSettings } from "../../../context/tableSettingsContext";
import { ProfileDetails } from "./components/profileDetails";
import { ScrollView } from "react-native-gesture-handler";



export const TablesTopAppBar = ({ ...props }: NativeStackHeaderProps) => {

    const { back, navigation } = props;

    const theme = useTheme()
    // const [settingsVisible, setSettingsVisible] = useState(false)

    return (
        <Appbar.Header mode={"center-aligned"} style={{
            height: 48,
            backgroundColor: theme.colors.elevation.level2
        }}>
            <Appbar.BackAction onPress={() => navigation.navigate(back.title)} />
            <Appbar.Content title="Tables" />
            {/* <Appbar.Action icon="cog-outline" onPress={() => setSettingsVisible(true)} /> */}
            <Appbar.Action icon="cog-outline" onPress={() => navigation.navigate("SettingsScreen")} />

            {/* <SettingsUnitCard visibility={[settingsVisible, setSettingsVisible]} /> */}

        </Appbar.Header>
    )
}


export const ZerosView = ({ hitResult }) => {
    const { tableSettings } = useTableSettings()

    return (
        tableSettings.displayZeros && <View>
            <View style={{ height: 40, justifyContent: "center" }}>
                <Text variant={"labelLarge"} style={{ textAlign: "center" }}>Zero crossing points</Text>
            </View>
            <ZerosDataTable hitResult={hitResult} />
        </View>
    )
}


export const TablesScreen = ({ navigation = null }) => {
    const theme = useTheme();
    const { hitResult } = useCalculator()

    const [settingsVisible, setSettingsVisible] = useState(false)

    const [layoutHeight, setLayoutHeight] = useState(0)
    const [topLayoutHeight, setTopLayoutHeight] = useState(0)
    const [botLayoutHeight, setBotLayoutHeight] = useState(0)

    const onExport = () => {
        console.log("On export")
    }

    const onSettings = () => {
        setSettingsVisible(true)
    }

    const handleLayout = (event) => {
        setLayoutHeight(event.nativeEvent.layout.height)
    }

    const handleTopLayout = (event) => {
        setTopLayoutHeight(event.nativeEvent.layout.height)
    }

    const handleBotLayout = (event) => {
        setBotLayoutHeight(event.nativeEvent.layout.height)
    }

    return (
        <ScrollView style={{
            flex: 1,
            backgroundColor: theme.colors.background,
            marginBottom: 64,
        }}
            onLayout={handleLayout}
            contentContainerStyle={{ height: topLayoutHeight + botLayoutHeight }}
        >
            <TableSettingsProvider>


                <TableSettingsDialog visible={settingsVisible} setVisible={setSettingsVisible} />

                <View
                    onLayout={handleTopLayout}
                >

                    <ProfileDetails />
                    <ZerosView hitResult={hitResult} />

                </View>


                <View
                    style={{ height: layoutHeight }}
                    onLayout={handleBotLayout}
                >
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <IconButton icon={"export-variant"} onPress={onExport} />
                        <View style={{ justifyContent: "center" }}>
                            <Text variant={"labelLarge"} style={{ textAlign: "center" }}>Trajectory</Text>
                        </View>
                        <IconButton icon={"tune"} onPress={onSettings} />
                    </View>
                    <TrajectoryTable hitResult={hitResult} style={{ flex: 1 }} />

                </View>

            </TableSettingsProvider>
        </ScrollView>
    )
}