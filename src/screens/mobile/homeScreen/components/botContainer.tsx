import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import { Surface, Text } from "react-native-paper";
import { useCalculator } from "../../../../context/profileContext";
import { HitResult } from "js-ballistics/dist/v2";
import { HoldPage } from "./holdPage";
import CarouselView from "./carouselView";
import { ShotTable } from "./shotTablePage";
import { useCurrentConditions } from "../../../../context/currentConditions";


const adjustmentSort = (closest, item) => {
    return Math.abs(item.dropAdjustment.rawValue) < Math.abs(closest.dropAdjustment.rawValue) ? item : closest;
};

const BotContainer = () => {
    const { profileProperties, adjustedResult } = useCalculator();
    const { windDirection } = useCurrentConditions();
    const [hold, setHold] = useState(null);

    useEffect(() => {
        if (adjustedResult instanceof HitResult) {

            const trajectory = adjustedResult?.trajectory;
            const holdRow = trajectory.slice(1).reduce(adjustmentSort, trajectory[1]);

            setHold({
                hold: adjustedResult?.shot?.relativeAngle,
                wind: holdRow.windageAdjustment,
            });
        }
    }, [adjustedResult, windDirection]);

    const shortInfo = useMemo(() => [
        `${(profileProperties?.bWeight / 10).toFixed(1)} gr.`,
        profileProperties?.bulletName || "",
        `${(profileProperties?.cMuzzleVelocity / 10).toFixed(0)} m/s`,
        `${profileProperties?.bcType}: ${(profileProperties?.coefRows?.[0].bcCd / 10000).toFixed(3)}`,
    ], [profileProperties]);

    return (
        <Surface style={styles.botContainer} elevation={0}>
            {profileProperties && (
                <Text style={styles.shortInfo} variant="labelMedium">
                    {shortInfo.join("; ")}
                </Text>
            )}
            <CarouselView>
                <HoldPage hold={hold} />
                <ShotTable />

                <Surface elevation={0}>
                    <Text style={{alignSelf: "center"}}>{"Nothing here yet\npage2"}</Text>
                </Surface>
            </CarouselView>
        </Surface>
    );
};

const styles = StyleSheet.create({
    botContainer: {
        flexDirection: "column",
        paddingBottom: 16,
    },
    shortInfo: {
        textAlign: "center",
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
});

export default BotContainer;