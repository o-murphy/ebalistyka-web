import { useState } from "react";
import { View } from "react-native";
import { IconButton, Text, useTheme } from "react-native-paper";
import { useCalculator } from "../../../context/profileContext";
import { TrajectoryTable, ZerosDataTable } from "./components/tableView";
import { TableSettingsProvider, useTableSettings } from "../../../context/tableSettingsContext";
import { ProfileDetails, TableSettingsDialog } from "./components";
import { ScrollView } from "react-native-gesture-handler";


const ZerosView = ({ hitResult }) => {
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


const TablesScreen = ({ navigation = null }) => {
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
            backgroundColor: theme.colors.surface,
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


export default TablesScreen;