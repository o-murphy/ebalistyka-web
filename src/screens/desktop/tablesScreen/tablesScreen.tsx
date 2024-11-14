import { useState } from "react";
import { StyleSheet } from "react-native";
import { IconButton, Surface, Text } from "react-native-paper";
import { useTableSettings } from "../../../context/tableSettingsContext";
import { TrajectoryTable, ZerosDataTable } from "../../mobile/tablesScreen/components/tableView";
import { ScrollViewSurface } from "../../mobile/components";
import { ProfileDetails, TableSettingsDialog } from "../../mobile/tablesScreen/components";
import { ScreenBackground } from "../components";
import { useCalculator } from "../../../context/calculatorContext";


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


export const TablesContent = () => {
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
        <ScrollViewSurface
            style={styles.scrollView}
            elevation={1}
            onLayout={handleLayout}
            contentContainerStyle={{
                height: topLayoutHeight + botLayoutHeight,
            }}
            surfaceStyle={styles.scrollViewContainer}
            overScrollMode="never"
            bounces={false}
            alwaysBounceVertical={false}
            scrollToOverflowEnabled={false}
        >
            <TableSettingsDialog visible={settingsVisible} setVisible={setSettingsVisible} />

            <Surface
                onLayout={handleTopLayout}
                elevation={0}
            >
                <ProfileDetails />
                <ZerosView hitResult={hitResult} />
            </Surface>

            <Surface
                style={{ height: layoutHeight }}
                onLayout={handleBotLayout}
                elevation={1}
            >
                <Surface style={{ flexDirection: "row", justifyContent: "space-between" }} elevation={0}>
                    <IconButton icon={"export-variant"} onPress={onExport} />
                    <Surface style={{ justifyContent: "center" }} elevation={0}>
                        <Text variant={"labelLarge"} style={{ textAlign: "center" }}>Trajectory</Text>
                    </Surface>
                    <IconButton icon={"tune"} onPress={onSettings} />
                </Surface>
                <TrajectoryTable hitResult={hitResult} style={{ flex: 1 }} />
            </Surface>

        </ScrollViewSurface>
    )
}


const TablesScreen = ({ navigation }) => {
    return (
        <ScreenBackground>
            {/* <Surface style={{padding: 8, margin: 16, borderRadius: 16, aspectRatio: 1, flex: 1, maxWidth: 900}}> */}
            <Surface style={[styles.surface, {padding: 8}]} elevation={0}>
                <Surface style={{ padding: 8, margin: 16, borderRadius: 16, aspectRatio: 1, flex: 1, maxWidth: 900 }}>
                    <TablesContent />
                </Surface>
            </Surface>
        </ScreenBackground>
    )
}


// const styles = StyleSheet.create({
//     scrollView: {
//         flex: 1,
//     },
//     scrollViewContainer: {
//     },
// })

const styles = StyleSheet.create({
    surface: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    column: {
        // margin: 8,
        marginBottom: 16,
        marginRight: 16,
        borderRadius: 16,
        overflow: "hidden",
        alignSelf: "flex-start"
    },
    scrollView: {
        flex: 1,
        margin: 16,
        borderRadius: 16,
        overflow: "hidden",
        // paddingBottom: 32,  // not uses on HomeContent
    },
    scrollViewContainer: {
        // додаткові стилі для контейнера
    },
});

export default TablesScreen;