import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { useCalculator } from "../../../../context/profileContext";
import { HitResult } from "js-ballistics/dist/v2";
import { HoldValuesContainer } from "./holdValuesContainer";
import { HoldReticleContainer } from "./holdReticleContainer";

const adjustmentSort = (closest, item) => {
    return Math.abs(item.dropAdjustment.rawValue) < Math.abs(closest.dropAdjustment.rawValue) ? item : closest;
};

const BotContainer = () => {
    const { profileProperties, currentConditions, adjustedResult } = useCalculator();
    const [hold, setHold] = useState(null);

    useEffect(() => {
        if (adjustedResult instanceof HitResult) {
            console.log(currentConditions.windDirection);
            const trajectory = adjustedResult?.trajectory;
            const holdRow = trajectory.slice(1).reduce(adjustmentSort, trajectory[1]);

            setHold({
                hold: adjustedResult?.shot?.relativeAngle,
                wind: holdRow.windageAdjustment,
            });
        }
    }, [adjustedResult, currentConditions.windDirection]);

    const shortInfo = useMemo(() => [
        `${(profileProperties?.bWeight / 10).toFixed(1)} gr.`,
        profileProperties?.bulletName || "",
        `${(profileProperties?.cMuzzleVelocity / 10).toFixed(0)} m/s`,
        `${profileProperties?.bcType}: ${(profileProperties?.coefRows?.[0].bcCd / 10000).toFixed(3)}`,
    ], [profileProperties]);

    return (
        <View style={styles.botContainer}>
            {profileProperties && (
                <Text style={styles.shortInfo} variant="labelMedium">
                    {shortInfo.join("; ")}
                </Text>
            )}
            <View style={styles.shotResultContainer}>
                <HoldReticleContainer hold={hold} />
                <HoldValuesContainer hold={hold} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    botContainer: {
        flexDirection: "column",
        padding: 8,
    },
    shortInfo: {
        textAlign: "center",
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    shotResultContainer: {
        flexDirection: "row",
        padding: 8,
        justifyContent: "space-between",
    },
});

export default BotContainer;