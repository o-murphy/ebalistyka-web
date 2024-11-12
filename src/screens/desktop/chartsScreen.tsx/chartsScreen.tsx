import { useState } from "react";
import { StyleSheet } from "react-native";
import { IconButton, Surface, Text } from "react-native-paper";
import { useCalculator } from "../../../context/profileContext";
import { TableSettingsProvider, useTableSettings } from "../../../context/tableSettingsContext";
import { TrajectoryTable, ZerosDataTable } from "../../mobile/tablesScreen/components/tableView";
import { ScrollViewSurface } from "../../mobile/components";
import { ProfileDetails, TableSettingsDialog } from "../../mobile/tablesScreen/components";
import { ScreenBackground } from "../components";
import { TileSurface } from "../homeScreen/homeScreen";
import { HorizontalTrajectoryChart, HorizontalWindageChart } from "../../../components/widgets/trajectoryData";


const ZerosView = ({ hitResult }) => {
    const { tableSettings } = useTableSettings()

    return (
        tableSettings.displayZeros && <Surface elevation={0}>
            <Surface style={{ height: 40, justifyContent: "center" }} elevation={0}>
                <Text variant={"labelLarge"} style={{ textAlign: "center" }}>Zero crossing points</Text>
            </Surface>
            <ZerosDataTable hitResult={hitResult} />
        </Surface>
    )
}


export const ChartsContent = () => {
    return (
        <HorizontalTrajectoryChart />
    )
}


const ChartsScreen = ({ navigation }) => {
    return (
        <ScreenBackground>
            <TileSurface heightRatio={1} widthRatio={2} style={{ padding: 8, margin: 16, borderRadius: 32 }}>
                <HorizontalTrajectoryChart />
            </TileSurface>

            <TileSurface heightRatio={1} widthRatio={2} style={{ padding: 8, margin: 16, borderRadius: 32 }}>
                <HorizontalWindageChart />
            </TileSurface>
            {/* <Surface style={{padding: 8, margin: 16, borderRadius: 32, aspectRatio: 1, flex: 1, maxWidth: 900}}>
                <ChartsContent />
            </Surface> */}
        </ScreenBackground>
    )
}


const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    scrollViewContainer: {
    },
})


export default ChartsScreen;