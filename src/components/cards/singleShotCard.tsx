import { Chip, Icon } from "react-native-paper";
import React, { useEffect, useRef } from "react";
import CustomCard from "./customCard";
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import { useCalculator } from "../../context/profileContext";
import { useTheme } from "../../context/themeContext";
import { usePreferredUnits } from "../../context/preferredUnitsContext";
import { Angular, Distance, UNew, Unit, UnitProps, Velocity } from "js-ballistics/dist/v2";
import { IconSource } from "react-native-paper/src/components/Icon";
import { DoubleSpinBox, SpinBoxProps } from "../widgets/doubleSpinBox";
import getFractionDigits from "../../utils/fractionConvertor";
import { MeasureFormFieldProps } from "../widgets/measureFields/measureField";
import { TargetShotTable } from "../widgets/trajectoryData/abstract/targetShotTable";


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

const TouchableValueSelector = ({ children, onUp, onDown }) => {
    const { theme } = useTheme()

    const _styles = {
        container: [styles.column, styles.selector, { backgroundColor: theme.colors.surfaceVariant }]
    }
    return (
        <View style={_styles.container}>

            <TouchableTile icon={"arrow-up"} iconSize={"150%"} onPress={onUp}/>
                {children}
            <TouchableTile icon={"arrow-down"} iconSize={"150%"} onPress={onDown}/>
        </View>
    )
}

const TargetRangeObserver = () => {

    const { fire, updMeasureErr, currentConditions, updateCurrentConditions } = useCalculator();

    const { preferredUnits } = usePreferredUnits()

    const targetRef = useRef(currentConditions)

    useEffect(() => {
        if (
            targetRef.current?.targetDistance !== currentConditions?.targetDistance
        ) {
            fire()
        }
    }, [currentConditions])

    const prefUnit = preferredUnits.distance
    const accuracy = getFractionDigits(1, UNew.Meter(1).In(prefUnit))

    const fieldProps: Partial<MeasureFormFieldProps> = {
        fKey: "targetDistance",
        label: "Target distance",
        icon: "target",
        fractionDigits: accuracy,
        step: 10 ** -accuracy * 10,
        suffix: UnitProps[prefUnit].symbol,
        minValue: UNew.Meter(10).In(prefUnit),
        maxValue: UNew.Meter(3000).In(prefUnit),
    }

    const value: number = UNew.Meter(
        currentConditions?.[fieldProps.fKey] ?
            currentConditions[fieldProps.fKey] : 2000
    ).In(prefUnit)

    const onValueChange = (value: number): void => {
        updateCurrentConditions({
            [fieldProps.fKey]: new Distance(value, prefUnit).In(Unit.Meter)
        })
    }

    // const debounceOnValue = useCallback(debounce(onValueChange, 350), [onValueChange]);


    const onErrorSet = (error: Error) => {
        updMeasureErr({fkey: fieldProps.fKey, isError: !!error})
    }
    
    const spinBoxProps: SpinBoxProps = {
        value: value,
        onValueChange: onValueChange,
        strict: true,
        onError: onErrorSet,
        minValue: fieldProps.minValue,
        maxValue: fieldProps.maxValue,
        fractionDigits: fieldProps.fractionDigits,
        step: fieldProps.step ?? 1,
        inputProps: {
            mode: "outlined",
            dense: true,
            style: [styles.spinBox, styles.inputStyle],
            contentStyle: styles.inputContentStyle,
            outlineStyle: styles.inputOutlineStyle,
        },
    }

    return (
        <TouchableValueSelector 
            onUp={() => onValueChange(value + spinBoxProps.step)}
            onDown={() => onValueChange(value - spinBoxProps.step)}
        >
            <DoubleSpinBox {...spinBoxProps} />
        </TouchableValueSelector>
    )
}

const TargetLookAngleObserver = () => {

    const { fire, updMeasureErr, currentConditions, updateCurrentConditions } = useCalculator();

    const { preferredUnits } = usePreferredUnits()

    const targetRef = useRef(currentConditions)

    useEffect(() => {
        if (
            targetRef.current?.lookAngle !== currentConditions?.lookAngle
        ) {
            fire()
        }
    }, [currentConditions])

    const prefUnit = preferredUnits.angular
    const accuracy = getFractionDigits(0.1, UNew.Degree(1).In(prefUnit))

    const fieldProps: Partial<MeasureFormFieldProps> = {
        fKey: "lookAngle",
        label: "Look angle",
        icon: "angle-acute",
        fractionDigits: accuracy,
        step: 1 / (10 ** accuracy),
        suffix: UnitProps[prefUnit].symbol,
        minValue: UNew.Degree(-90).In(prefUnit),
        maxValue: UNew.Degree(90).In(prefUnit),
    }

    const value: number = UNew.Degree(
        currentConditions?.[fieldProps.fKey] ? 
        currentConditions[fieldProps.fKey] : 0
    ).In(prefUnit)

    const onValueChange = (value: number): void => {
        updateCurrentConditions({
            [fieldProps.fKey]: new Angular(value, prefUnit).In(Unit.Degree)
        })
    }

    // const debounceOnValue = useCallback(debounce(onValueChange, 350), [onValueChange]);


    const onErrorSet = (error: Error) => {
        updMeasureErr({fkey: fieldProps.fKey, isError: !!error})
    }
    
    const spinBoxProps: SpinBoxProps = {
        value: value,
        onValueChange: onValueChange,
        strict: true,
        onError: onErrorSet,
        minValue: fieldProps.minValue,
        maxValue: fieldProps.maxValue,
        fractionDigits: fieldProps.fractionDigits,
        step: fieldProps.step ?? 1,
        inputProps: {
            mode: "outlined",
            dense: true,
            style: [styles.spinBox, styles.inputStyle],
            contentStyle: styles.inputContentStyle,
            outlineStyle: styles.inputOutlineStyle,
        },
    }

    return (
        <TouchableValueSelector 
            onUp={() => onValueChange(value + spinBoxProps.step)}
            onDown={() => onValueChange(value - spinBoxProps.step)}
        >
            <DoubleSpinBox {...spinBoxProps} />
        </TouchableValueSelector>
    )
}

const TargetWindSpeedObserver = () => {

    const { fire, updMeasureErr, currentConditions, updateCurrentConditions } = useCalculator();

    const { preferredUnits } = usePreferredUnits()

    const targetRef = useRef(currentConditions)

    useEffect(() => {
        if (
            targetRef.current?.windSpeed !== currentConditions?.windSpeed
        ) {
            fire()
        }
    }, [currentConditions])

    const prefUnit = preferredUnits.velocity

    const accuracy = getFractionDigits(0.1, UNew.MPS(1).In(prefUnit))

    const fieldProps: Partial<MeasureFormFieldProps> = {
        fKey: "windSpeed",
        label: "Wind speed",
        icon: "windsock",
        fractionDigits: accuracy,
        step: 10 ** -accuracy,
        suffix: UnitProps[prefUnit].symbol,
        minValue: UNew.MPS(0).In(preferredUnits.velocity),
        maxValue: UNew.MPS(100).In(preferredUnits.velocity),
    }

    const value: number = UNew.MPS(
        currentConditions?.[fieldProps.fKey] ? 
        currentConditions[fieldProps.fKey] : 0
    ).In(prefUnit)

    const onValueChange = (value: number): void => {
        updateCurrentConditions({
            [fieldProps.fKey]: new Velocity(value, prefUnit).In(Unit.MPS)
        })
    }

    // const debounceOnValue = useCallback(debounce(onValueChange, 350), [onValueChange]);


    const onErrorSet = (error: Error) => {
        updMeasureErr({fkey: fieldProps.fKey, isError: !!error})
    }
    
    const spinBoxProps: SpinBoxProps = {
        value: value,
        onValueChange: onValueChange,
        strict: true,
        onError: onErrorSet,
        minValue: fieldProps.minValue,
        maxValue: fieldProps.maxValue,
        fractionDigits: fieldProps.fractionDigits,
        step: fieldProps.step ?? 1,
        inputProps: {
            mode: "outlined",
            dense: true,
            style: [styles.spinBox, styles.inputStyle],
            contentStyle: styles.inputContentStyle,
            outlineStyle: styles.inputOutlineStyle,
        },
    }

    return (
        <TouchableValueSelector 
            onUp={() => onValueChange(value + spinBoxProps.step)}
            onDown={() => onValueChange(value - spinBoxProps.step)}
        >
            <DoubleSpinBox {...spinBoxProps} />
        </TouchableValueSelector>
    )
}

const TargetWindDirObserver = () => {

    const { fire, updMeasureErr, currentConditions, updateCurrentConditions } = useCalculator();

    const targetRef = useRef(currentConditions)

    useEffect(() => {
        if (
            targetRef.current?.windDirection !== currentConditions?.windDirection
        ) {
            fire()
        }
    }, [currentConditions])

    const prefUnit = Unit.Degree

    const accuracy = getFractionDigits(1, UNew.Degree(1).In(prefUnit))

    const fieldProps: Partial<MeasureFormFieldProps> = {
        fKey: "windDirection",
        label: "Wind direction",
        icon: "windsock",
        fractionDigits: accuracy,
        step: 30,
        suffix: UnitProps[prefUnit].symbol,
        minValue: 0,
        maxValue: 360,
    }

    const value: number = UNew.Degree(
        currentConditions?.[fieldProps.fKey] ? 
        currentConditions[fieldProps.fKey] * fieldProps.step : 0
    ).In(prefUnit)

    const onValueChange = (value: number): void => {
        updateCurrentConditions({
            [fieldProps.fKey]: value / fieldProps.step
        })
    }

    // const debounceOnValue = useCallback(debounce(onValueChange, 350), [onValueChange]);


    const onErrorSet = (error: Error) => {
        updMeasureErr({fkey: fieldProps.fKey, isError: !!error})
    }
    
    const spinBoxProps: SpinBoxProps = {
        value: value,
        onValueChange: onValueChange,
        strict: true,
        onError: onErrorSet,
        minValue: fieldProps.minValue,
        maxValue: fieldProps.maxValue,
        fractionDigits: fieldProps.fractionDigits,
        step: fieldProps.step ?? 1,
        inputProps: {
            mode: "outlined",
            dense: true,
            style: [styles.spinBox, styles.inputStyle],
            contentStyle: styles.inputContentStyle,
            outlineStyle: styles.inputOutlineStyle,
            // editable: false,
        },
    }

    return (
        <TouchableValueSelector 
            onUp={() => onValueChange(value + spinBoxProps.step)}
            onDown={() => onValueChange(value - spinBoxProps.step)}
        >
            <DoubleSpinBox {...spinBoxProps} />
        </TouchableValueSelector>
    )
}

const SingleShotCard: React.FC<SingleShotCardProps> = ({ expanded = true }) => {
    const { profileProperties, adjustedResult } = useCalculator();
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
                    <Chip style={_styles.chipStyle} textStyle={_styles.chipTextStyle}>{`Look (${UnitProps[preferredUnits.angular].symbol})`}</Chip>
                    <Chip style={_styles.chipStyle} textStyle={_styles.chipTextStyle}>{`Wind (${UnitProps[preferredUnits.velocity].symbol})`}</Chip>
                    <Chip style={_styles.chipStyle} textStyle={_styles.chipTextStyle}>{`Dir (${UnitProps[Unit.Degree].symbol})`}</Chip>
                </View>
                <View style={styles.row}>
                    <TargetRangeObserver />
                    <TargetLookAngleObserver />
                    <TargetWindSpeedObserver />
                    <TargetWindDirObserver />
                </View >
            </View >
            <TargetShotTable hitResult={adjustedResult}/>
        </CustomCard >
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
        maxWidth: 400
    },
    card: {
        overflow: "hidden"
    }
})

export default SingleShotCard;
