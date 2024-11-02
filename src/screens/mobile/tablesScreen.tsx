import { StyleSheet, View } from "react-native";
import { useTheme } from "../../context/themeContext";
import { Appbar, Button, List, Text } from "react-native-paper";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { useState } from "react";
import SettingsUnitCard from "../../components/cards/settingsCard";
import { useCalculator } from "../../context/profileContext";
import ResponsiveTableView from "../../components/widgets/tableView/tableView";
import { HitResult, TrajectoryData, TrajFlag } from "js-ballistics/dist/v2";


export const TablesTopAppBar = ({ ...props }: NativeStackHeaderProps) => {

    const { back, navigation } = props;

    const { theme } = useTheme()
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


export const TablesScreen = ({ navigation }) => {
    const { theme } = useTheme();
    const { hitResult } = useCalculator()

    const [expandedIndex, setExpandedIndex] = useState(0)

    return (
        <View style={{
            flex: 1,
            backgroundColor: theme.colors.background,
            marginBottom: 64,
        }}>

            <ResponsiveTableView hitResult={hitResult} style={{ flex: 1 }} />

            <View style={{ flexDirection: "row", alignItems: "center", padding: 16, justifyContent: "space-around" }}>
                <Button mode="elevated" style={{ width: "40%" }}>Settings</Button>
                <Button mode="elevated" style={{ width: "40%" }}>Export</Button>
            </View>
        </View>
    )
}