import { Text, Chip, Button, FAB, Icon, TextInput } from "react-native-paper";
import React, { useEffect, useRef, useState } from "react";
import CustomCard from "./customCard";
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import { CalculationState, useCalculator } from "../../context/profileContext";
import { BulletLengthField, BulletWeightField, CaliberField } from "../widgets/measureFields";
import { ProfileProps } from "../../utils/parseA7P";
import RecalculateChip from "../widgets/recalculateChip";
import { TextInputChip } from "../widgets/inputChip";
import { useTheme } from "../../context/themeContext";
import { usePreferredUnits } from "../../context/preferredUnitsContext";
import { UNew } from "js-ballistics/dist/v2";
import { DoubleSpinBox } from "../widgets/doubleSpinBox";
import { IconSource } from "react-native-paper/src/components/Icon";

interface SingleShotCardProps {
    expanded?: boolean;
}


interface TouchableTileProps {
    style?: StyleProp<ViewStyle>;
    icon?: IconSource;
    iconSize?: number;
    onPress?: () => void;
}

const TouchableTile: React.FC<TouchableTileProps> = ({
    style = null,
    icon = null,
    iconSize = null,
    onPress = null,
}) => {
    const { theme } = useTheme()
    return (
        <TouchableOpacity
            style={[styles.touchable, style]}
            onPress={() => { onPress?.() }}
        >
            <Icon size={iconSize} color={theme.colors.primary} source={icon} />
        </TouchableOpacity>
    )
}

const TouchableValueSelector = ({ value, onValueChange }) => {
    const { theme } = useTheme()

    return (
        // <View style={{flex: 1}}>
        <View style={[styles.column, styles.selector, { backgroundColor: theme.colors.surfaceVariant }]}>

            <TouchableTile icon={"arrow-up"} iconSize={128 / 3} />
            <View
                style={styles.touchable}
            >
                <DoubleSpinBox
                    showError={false}
                    style={styles.spinBox}
                    value={value}
                    onValueChange={value => onValueChange?.(value)}
                    inputProps={
                        {
                            mode: "outlined",
                            style: styles.inputStyle,
                            contentStyle: styles.inputContentStyle,
                            outlineStyle: styles.inputOutlineStyle,
                        }
                    } />
            </View>
            <TouchableTile icon={"arrow-down"} iconSize={128 / 3} />
        </View>

        // </View>

    )
}

const SingleShotCard: React.FC<SingleShotCardProps> = ({ expanded = true }) => {
    const { profileProperties, currentConditions, updateCurrentConditions, calcState } = useCalculator();
    const { preferredUnits } = usePreferredUnits()
    const [refreshable, setRefreshable] = useState(false)

    const { theme } = useTheme()

    const prevProfilePropertiesRef = useRef<ProfileProps | null>(null);

    if (!profileProperties) {
        return (
            <CustomCard title={"Bullet"} expanded={expanded} />
        )
    }

    return (
        <CustomCard title={"Shot params"} expanded={expanded}>
            <View style={[styles.column, {minWidth: "80%"}]}>
                <View style={[styles.row, { width: "100%", alignSelf: "center", alignItems: "center", justifyContent: "center" }]}>
                    <Chip style={[styles.column, styles.touchable, { backgroundColor: theme.colors.surfaceVariant }]}>Distance</Chip>
                    <Chip style={[styles.column, styles.touchable, { backgroundColor: theme.colors.surfaceVariant }]}>Wind speed</Chip>
                    <Chip style={[styles.column, styles.touchable, { backgroundColor: theme.colors.surfaceVariant }]}>Wind dir.</Chip>
                </View>
                <View style={[styles.row, { width: "100%", alignSelf: "center", alignItems: "center", justifyContent: "center" }]}>
                    <TouchableValueSelector value={UNew.Meter(currentConditions.targetDistance).In(preferredUnits.distance)} />
                    <TouchableValueSelector value={UNew.MPS(currentConditions.windSpeed).In(preferredUnits.velocity)} />
                    <TouchableValueSelector value={UNew.Degree(currentConditions.windSpeed).In(preferredUnits.angular)} />
                </View>
            </View>
        </CustomCard>
    );
};


const styles = StyleSheet.create({
    spinBox: { flex: 1, maxWidth: "100%", maxHeight: "100%" },
    inputStyle: { flex: 1, maxWidth: "100%", maxHeight: "100%", justifyContent: "center" },
    inputContentStyle: { textAlign: "center" },
    inputOutlineStyle: {},

    touchable: { flex: 1, alignItems: "center", justifyContent: "center" },

    nameContainer: {
        flex: 1,
    },
    row: {
        flexDirection: "row",
        marginVertical: 4
    },
    column: {
        flexDirection: "column",
        alignSelf: "center",
        marginHorizontal: 4,
    },
    label: {
        fontSize: 14
    },
    selector: {
        height: 128,
        aspectRatio: 1,
        flex: 1,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        backgroundColor: "transparent",
        overflow: "hidden",
    }
})

export default SingleShotCard;
