import { Chip, Icon } from "react-native-paper";
import React from "react";
import CustomCard from "./customCard";
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import { useCalculator } from "../../context/profileContext";
import { useTheme } from "../../context/themeContext";
import { usePreferredUnits } from "../../context/preferredUnitsContext";
import { UNew, Unit, UnitProps } from "js-ballistics/dist/v2";
import { DoubleSpinBox } from "../widgets/doubleSpinBox";
import { IconSource } from "react-native-paper/src/components/Icon";
import WindDirectionPicker from "../widgets/windDirectionPicker";

interface SingleShotCardProps {
    expanded?: boolean;
}


interface TouchableTileProps {
    style?: StyleProp<ViewStyle>;
    icon?: IconSource;
    iconSize?: number | string;
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
            style={[styles.center, style]}
            onPress={() => { onPress?.() }}
        >
            <Icon size={iconSize} color={theme.colors.primary} source={icon} />
        </TouchableOpacity>
    )
}

const TouchableValueSelector = ({ value, onValueChange }) => {
    const { theme } = useTheme()

    const _styles = {
        container: [styles.column, styles.selector, { backgroundColor: theme.colors.surfaceVariant }]
    }

    return (
        <View style={_styles.container}>

            <TouchableTile icon={"arrow-up"} iconSize={"150%"} />
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
            <TouchableTile icon={"arrow-down"} iconSize={"150%"} />
        </View>
    )
}

const SingleShotCard: React.FC<SingleShotCardProps> = ({ expanded = true }) => {
    const { profileProperties, currentConditions, updateCurrentConditions, calcState } = useCalculator();
    const { preferredUnits } = usePreferredUnits()

    const { theme } = useTheme()


    if (!profileProperties) {
        return (
            <CustomCard title={"Bullet"} expanded={expanded} />
        )
    }

    const _styles = {
        container: {
            ...styles.column, 
            ...styles.center, 
            ...styles.container
        },
        chipStyle: {
            ...styles.column, 
            ...styles.center, 
            backgroundColor: theme.colors.surfaceVariant,
        },
        chipTextStyle: {
            fontSize: "80%"
        }
    }

    return (
        <CustomCard title={"Shot params"} expanded={expanded} style={styles.card}>
            <View style={_styles.container}>
                <View style={styles.row}>
                    <Chip style={_styles.chipStyle} textStyle={_styles.chipTextStyle}>{`Range (${UnitProps[preferredUnits.distance].symbol})`}</Chip>
                    <Chip style={_styles.chipStyle} textStyle={_styles.chipTextStyle}>{`Wind (${UnitProps[preferredUnits.velocity].symbol})`}</Chip>
                    <Chip style={_styles.chipStyle} textStyle={_styles.chipTextStyle}>{`Dir (${UnitProps[Unit.Degree].symbol})`}</Chip>
                </View>
                <View style={styles.row}>
                    <TouchableValueSelector value={UNew.Meter(currentConditions.targetDistance).In(preferredUnits.distance)} />
                    <TouchableValueSelector value={UNew.MPS(currentConditions.windSpeed).In(preferredUnits.velocity)} />
                    <TouchableValueSelector value={UNew.Degree(currentConditions.windSpeed).In(preferredUnits.angular)} />
                </View>
            </View>
        </CustomCard>
    );
};


const styles = StyleSheet.create({
    spinBox: {
        flex: 1,
        width: "100%",
        maxHeight: "100%"
    },
    inputStyle: {
        flex: 1,
        width: "100%",
        maxHeight: "100%",
        justifyContent: "center"
    },
    inputContentStyle: {
        flex: 1,
        textAlign: "center",
        width: "100%"
    },
    inputOutlineStyle: {
        flex: 1,
        width: "100%",
    },
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    row: {
        flexDirection: "row",
        marginVertical: 4,
        width: "100%",
    },
    column: {
        flexDirection: "column",
        marginHorizontal: 4,
        height: "100%"
    },
    selector: {
        flex: 1,
        aspectRatio: 1,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        backgroundColor: "transparent",
        overflow: "hidden",
    },
    container: {
        alignSelf: "center", 
        maxWidth: 300
    },
    card: {
        overflow: "hidden"
    }
})

export default SingleShotCard;
