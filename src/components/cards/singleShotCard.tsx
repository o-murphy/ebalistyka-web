import { Chip } from "react-native-paper";
import React, { useMemo, useState } from "react";
import CustomCard from "./customCard";
import { StyleSheet, View } from "react-native";
import { useCalculator } from "../../context/profileContext";
import { useTheme } from "../../context/themeContext";
import { usePreferredUnits } from "../../context/preferredUnitsContext";
import { Unit, UnitProps } from "js-ballistics/dist/v2";
import { TargetShotTable } from "../widgets/trajectoryData/abstract/targetShotTable";
import { TargetRangeClickable, TargetLookAngleClickable, TargetWindSpeedClickable, TargetWindDirClickable } from "../widgets/measureFields/clickableField";


interface SingleShotCardProps {
    expanded?: boolean;
}


const SingleShotChips = ({ chipLabels }) => {
    const [chipTextStyle, setChipTextStyle] = useState({ fontSize: 12 });
    const { theme } = useTheme();

    // Memoize styles to prevent recalculation on every render
    const _styles = useMemo(() => StyleSheet.create({
        chipStyle: {
            ...styles.column,
            ...styles.center,
            backgroundColor: theme.colors.surfaceVariant,
        },
    }), [theme.colors.surfaceVariant]);

    const handleLayout = (event) => {
        const { width } = event.nativeEvent.layout;
        // Dynamically adjust the chipTextStyle based on the layout height
        setChipTextStyle({ fontSize: (width / chipLabels.length) * 0.12 }); // Set fontSize to 20% of height for example
    };

    return (
        <View style={styles.row} onLayout={handleLayout}>
            {chipLabels.map((label, index) => (
                // <Chip key={index} style={_styles.chipStyle} textStyle={_styles.chipTextStyle}>
                <Chip key={index} style={_styles.chipStyle} textStyle={chipTextStyle}>

                    {label}
                </Chip>
            ))}
        </View>
    )
}


const SingleShotCard: React.FC<SingleShotCardProps> = ({ expanded = true }) => {
    const { profileProperties, adjustedResult } = useCalculator();
    const { preferredUnits } = usePreferredUnits();

    // Handle loading or error state
    if (!profileProperties) {
        return <CustomCard title="Bullet" expanded={expanded} />;
    }

    // Define chip labels for clarity
    const chipLabels = [
        `Range (${UnitProps[preferredUnits.distance].symbol})`,
        `Look (${UnitProps[preferredUnits.angular].symbol})`,
        `Wind (${UnitProps[preferredUnits.velocity].symbol})`,
        `Dir (${UnitProps[Unit.Degree].symbol})`
    ];

    const _styles = StyleSheet.create({
        container: {
            ...styles.column,
            ...styles.center,
            ...styles.container,
        },
    });

    return (
        <CustomCard title="Shot params" expanded={expanded} style={[styles.card]}>
            <View style={[styles.row]} >
                <View style={[_styles.container, styles.selector]}>
                    <SingleShotChips chipLabels={chipLabels} />
                    <View style={[styles.row]}>
                        <TargetRangeClickable />
                        <TargetLookAngleClickable />
                        <TargetWindSpeedClickable />
                        <TargetWindDirClickable />
                    </View>
                </View>
                <View style={[_styles.container, styles.selector, { marginHorizontal: 8 }]}>
                    <TargetShotTable hitResult={adjustedResult} />
                </View>
            </View>
        </CustomCard>
    );
};


const styles = StyleSheet.create({
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    row: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginVertical: 4,
        width: "100%",
        alignItems: "center",
        justifyContent: "center"
    },
    column: {
        flexDirection: "column",
        marginHorizontal: 4,
        flex: 1,
    },
    container: {
        alignSelf: "center",
        maxWidth: 400,
    },
    selector: {
        minWidth: 300,
    },
    card: {
        overflow: "hidden"
    }
})

export default SingleShotCard;
