import { ScrollView, StyleSheet, View } from "react-native";
import { useTheme } from "../../context/themeContext";
import { Appbar, Chip, Divider, List, Text } from "react-native-paper";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { useCalculator } from "../../context/profileContext";
import { UNew, Atmo, HitResult, UnitProps } from "js-ballistics/dist/v2";
import { usePreferredUnits } from "../../context/preferredUnitsContext";
import { useEffect, useState } from "react";


export const ShotInfoTopAppBar = ({ ...props }: NativeStackHeaderProps) => {

    const { back, navigation } = props;
    const { theme } = useTheme()

    return (
        <Appbar.Header mode={"center-aligned"} style={{
            height: 48,
            backgroundColor: theme.colors.elevation.level2
        }}>
            <Appbar.BackAction onPress={() => navigation.navigate(back.title)} />
            <Appbar.Content title="Shot info" />
        </Appbar.Header>
    )
}


const InfoRow = ({ title, value, icon = null, last = false }) => (
    <View>
    <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center", marginVertical: 8, marginHorizontal: 16 }}>
        <Text style={{ flex: 2 }}>{title}</Text>
        <Chip style={{ flex: 1 }} icon={icon} >{value}</Chip>
    </View>
    {!last && <Divider />}
    </View>
)


const adjustmentSort = (closest, item) => {
    return Math.abs(item.dropAdjustment.rawValue) < Math.abs(closest.dropAdjustment.rawValue) ? item : closest
}


export const ShotInfoScreen = ({ navigation }) => {
    const { theme } = useTheme();

    const { currentConditions, profileProperties, adjustedResult } = useCalculator()
    const { preferredUnits } = usePreferredUnits()

    const [hold, setHold] = useState(null)

    useEffect(() => {
        if (adjustedResult instanceof HitResult) {
            console.log(currentConditions.windDirection)
            const trajectory = adjustedResult?.trajectory
            const holdRow = trajectory.slice(1).reduce(
                adjustmentSort, trajectory[1]
            );

            setHold({
                hold: adjustedResult?.shot?.relativeAngle,
                ...holdRow
            })
        }
    }, [adjustedResult])

    const styles = StyleSheet.create({
        scrollViewContainer: {
            backgroundColor: theme.colors.background,
            paddingBottom: 64, 
        },
    });

    const trajectory = adjustedResult instanceof HitResult && adjustedResult.trajectory

    const rows = [
        {
            title: "Shot distance",
            value: UNew.Meter(currentConditions?.targetDistance).In(preferredUnits.distance).toFixed(0) + ` ${UnitProps[preferredUnits.distance].symbol}`
        },
        {
            title: "Muzzle velocity",
            value: UNew.MPS(profileProperties?.cMuzzleVelocity / 10).In(preferredUnits.velocity).toFixed(1) + ` ${UnitProps[preferredUnits.velocity].symbol}`
        },
        {
            title: "Adjusted muzzle velocity",
            value: '<NaN>'
        },
        {
            title: "Speed of sound",
            value: new Atmo({
                pressure: UNew.hPa(currentConditions.pressure),
                temperature: UNew.Celsius(currentConditions.temperature),
                humidity: currentConditions.humidity,
            }).mach.In(preferredUnits.velocity).toFixed(1) + ` ${UnitProps[preferredUnits.velocity].symbol}`
        },
        {
            title: "Velocity on target",
            value: hold && hold.velocity.In(preferredUnits.velocity).toFixed(0) + ` ${UnitProps[preferredUnits.velocity].symbol}`
        },
        {
            title: "Start energy",
            value: trajectory && trajectory[0].energy.In(preferredUnits.energy).toFixed(0) + ` ${UnitProps[preferredUnits.energy].symbol}`
        },
        {
            title: "Energy on target",
            value: hold && hold.energy.In(preferredUnits.energy).toFixed(0) + ` ${UnitProps[preferredUnits.energy].symbol}`
        },
        {
            title: "Trajectory max height",
            value: trajectory && trajectory.reduce((prev, current) => (current.height.rawValue > prev.height.rawValue ? current : prev)).height.In(preferredUnits.distance).toFixed(2) + ` ${UnitProps[preferredUnits.distance].symbol}`
        },
        {
            title: "Max height's distance",
            value: trajectory && trajectory.reduce((prev, current) => (current.height.rawValue > prev.height.rawValue ? current : prev)).distance.In(preferredUnits.distance).toFixed(2) + ` ${UnitProps[preferredUnits.distance].symbol}`
        },
        {
            title: "Derivation",
            value: '<NaN>',
        },
        {
            title: "Wind drift",
            value: '<NaN>',
        },
        {
            title: "Time to target",
            value: `${hold && hold.time.toFixed(3)} s`

        },
        {
            title: "Hold in clicks",
            value: '<NaN>',
            icon: "arrow-expand-horizontal"
        },
        {
            title: "Windage in clicks",
            value: '<NaN>',
            icon: "arrow-expand-vertical",
            last: true
        },
    ]

    return (
        <ScrollView
            style={styles.scrollViewContainer}
            keyboardShouldPersistTaps="always"
            alwaysBounceVertical={false}
            showsVerticalScrollIndicator={true}

            contentContainerStyle={{
                overflow: "hidden",
                backgroundColor: theme.colors.elevation.level1,
                borderBottomRightRadius: 32, borderBottomLeftRadius: 32,
                paddingBottom: 16
            }}
        >
            <View>
                {rows.map((item, index) => <InfoRow key={`${index}`} {...item} />)}
            </View>

        </ScrollView>
    )
}