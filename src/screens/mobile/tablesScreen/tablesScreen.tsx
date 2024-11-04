import { useState } from "react";
import { View } from "react-native";
import { Appbar, IconButton, Text, useTheme } from "react-native-paper";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import SettingsUnitCard from "../../../components/cards/settingsCard";
import { useCalculator } from "../../../context/profileContext";
import { TrajectoryTable, ZerosDataTable } from "../../../components/widgets/tableView/tableView";
import { TableSettingsDialog } from "./components/tablesSettingsDialog";
import { TableSettingsProvider } from "../../../context/tableSettingsContext";



export const TablesTopAppBar = ({ ...props }: NativeStackHeaderProps) => {

    const { back, navigation } = props;

    const theme = useTheme()
    const [settingsVisible, setSettingsVisible] = useState(false)

    return (
        <Appbar.Header mode={"center-aligned"} style={{
            height: 48,
            backgroundColor: theme.colors.elevation.level2
        }}>
            <Appbar.BackAction onPress={() => navigation.navigate(back.title)} />
            <Appbar.Content title="Tables" />
            <Appbar.Action icon="cog-outline" onPress={() => setSettingsVisible(true)} />

            <SettingsUnitCard visibility={[settingsVisible, setSettingsVisible]} />

        </Appbar.Header>
    )
}


export const TablesScreen = ({ navigation = null }) => {
    const theme = useTheme();
    const { hitResult } = useCalculator()

    const [settingsVisible, setSettingsVisible] = useState(false)

    const onExport = () => {
        console.log("On export")
    }

    const onSettings = () => {
        setSettingsVisible(true)
    }

    return (
        <TableSettingsProvider>

            <View style={{
                flex: 1,
                backgroundColor: theme.colors.background,
                marginBottom: 64,
            }}>

                <TableSettingsDialog visible={settingsVisible} setVisible={setSettingsVisible} />

                <View style={{ height: 40, justifyContent: "center" }}>
                    <Text style={{ textAlign: "center" }}>Zero crossing points</Text>
                </View>

                <ZerosDataTable hitResult={hitResult} />

                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <IconButton icon={"export-variant"} onPress={onExport} />
                    <View style={{ justifyContent: "center" }}>
                        <Text style={{ textAlign: "center" }}>Trajectory</Text>
                    </View>
                    <IconButton icon={"tune"} onPress={onSettings} />
                </View>

                <TrajectoryTable hitResult={hitResult} style={{ flex: 1 }} />
            </View>

        </TableSettingsProvider>
    )
}