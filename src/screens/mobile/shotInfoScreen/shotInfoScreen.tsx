import { ScrollView, StyleSheet, View } from "react-native";
import { Chip, Divider, Text, useTheme } from "react-native-paper";
import { useCalculator } from "../../../context/profileContext";
import { UNew, Atmo, HitResult, UnitProps } from "js-ballistics/dist/v2";
import { usePreferredUnits } from "../../../context/preferredUnitsContext";
import { useEffect, useState, useMemo } from "react";

const InfoRow = ({ title, value, icon = null, last = false }) => (
    <View>
        <View style={styles.infoRow}>
            <Text style={styles.title}>{title}</Text>
            <Chip style={styles.valueChip} icon={icon}>{value}</Chip>
        </View>
        {!last && <Divider />}
    </View>
);

// Helper function to format units
const formatUnit = (value, unit, precision = 1) =>
    value ? `${value.In(unit).toFixed(precision)} ${UnitProps[unit].symbol}` : '<NaN>';

// Helper function for calculating speed of sound
const calculateSpeedOfSound = (conditions, unit) => {
    if (!conditions) return '<NaN>';
    const { pressure, temperature, humidity } = conditions;
    const speedOfSound = new Atmo({
        pressure: UNew.hPa(pressure),
        temperature: UNew.Celsius(temperature),
        humidity: humidity,
    }).mach;
    return formatUnit(speedOfSound, unit);
};

const adjustmentSort = (closest, item) =>
    Math.abs(item.dropAdjustment.rawValue) < Math.abs(closest.dropAdjustment.rawValue) ? item : closest;


const ShotInfoScreen = () => {
    const theme = useTheme();
    const { currentConditions, profileProperties, adjustedResult } = useCalculator();
    const { preferredUnits } = usePreferredUnits();
    const [hold, setHold] = useState(null);

    useEffect(() => {
        if (adjustedResult instanceof HitResult) {
            const trajectory = adjustedResult.trajectory || [];
            const holdRow = trajectory.slice(1).reduce(adjustmentSort, trajectory[1]);
            setHold({
                hold: adjustedResult?.shot?.relativeAngle,
                ...holdRow
            });
        }
    }, [adjustedResult]);

    const trajectory = adjustedResult instanceof HitResult ? adjustedResult.trajectory : null;

    const rows = useMemo(() => {
        const targetDistance = formatUnit(
            UNew.Meter(currentConditions?.targetDistance), 
            preferredUnits.distance, 
            0
        );

        const muzzleVelocity = formatUnit(
            UNew.MPS(profileProperties?.cMuzzleVelocity / 10), 
            preferredUnits.velocity
        );

        const speedOfSound = calculateSpeedOfSound(currentConditions, preferredUnits.velocity);

        const velocityOnTarget = hold?.velocity 
            ? formatUnit(hold.velocity, preferredUnits.velocity, 0) 
            : '<NaN>';

        const startEnergy = trajectory?.[0].energy 
            ? formatUnit(trajectory[0].energy, preferredUnits.energy, 0) 
            : '<NaN>';

        const energyOnTarget = hold?.energy 
            ? formatUnit(hold.energy, preferredUnits.energy, 0) 
            : '<NaN>';

        const maxHeightPoint = trajectory 
            ? trajectory.reduce((prev, curr) => (curr.height.rawValue > prev.height.rawValue ? curr : prev)) 
            : null;
        
        const maxHeight = maxHeightPoint 
            ? formatUnit(maxHeightPoint.height, preferredUnits.distance, 2) 
            : '<NaN>';

        const maxHeightDistance = maxHeightPoint 
            ? formatUnit(maxHeightPoint.distance, preferredUnits.distance, 2) 
            : '<NaN>';

        const timeToTarget = hold?.time?.toFixed(3) || '<NaN>';

        return [
            { title: "Shot distance", value: targetDistance },
            { title: "Muzzle velocity", value: muzzleVelocity },
            { title: "Adjusted muzzle velocity", value: '<NaN>' },
            { title: "Speed of sound", value: speedOfSound },
            { title: "Velocity on target", value: velocityOnTarget },
            { title: "Start energy", value: startEnergy },
            { title: "Energy on target", value: energyOnTarget },
            { title: "Trajectory max height", value: maxHeight },
            { title: "Max height's distance", value: maxHeightDistance },
            { title: "Derivation", value: '<NaN>' },
            { title: "Wind drift", value: '<NaN>' },
            { title: "Time to target", value: `${timeToTarget} s` },
            { title: "Hold in clicks", value: '<NaN>', icon: "arrow-expand-horizontal" },
            { title: "Windage in clicks", value: '<NaN>', icon: "arrow-expand-vertical", last: true },
        ];
    }, [hold, trajectory, currentConditions, profileProperties, preferredUnits]);

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
            <ScrollView
                style={[styles.scrollView, { backgroundColor: theme.colors.surface }]}
                keyboardShouldPersistTaps="always"
                alwaysBounceVertical={false}
                showsVerticalScrollIndicator
                contentContainerStyle={[styles.scrollViewContainer, { backgroundColor: theme.colors.elevation.level1 }]}
            >
                {rows.map((item, index) => <InfoRow key={index} {...item} />)}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 32,
    },
    scrollView: {
        flex: 1,
        paddingBottom: 64,
    },
    scrollViewContainer: {
        paddingBottom: 16,
        borderBottomRightRadius: 32,
        borderBottomLeftRadius: 32,
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        flex: 2,
    },
    valueChip: {
        flex: 1,
    },
});

export default ShotInfoScreen;