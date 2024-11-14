import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useProfile } from "../../../../context/profileContext";
import { usePreferredUnits } from "../../../../context/preferredUnitsContext";
import { UNew, Unit, UnitProps, Velocity } from "js-ballistics/dist/v2";
import { DoubleSpinBox, SpinBoxProps } from "../../doubleSpinBox";
import getFractionDigits from "../../../../utils/fractionConvertor";
import { MeasureFormFieldProps } from "../measureField";
import debounce from "../../../../utils/debounce";
import { StyleSheet } from "react-native";
import { TouchableValueSelector } from "./touchableSelector";


const TargetWindSpeedClickable = () => {
    const { fire, updMeasureErr, currentConditions, updateCurrentConditions } = useProfile();
    const { preferredUnits } = usePreferredUnits();
    const targetRef = useRef(currentConditions);

    const [isFiring, setIsFiring] = useState(false); // Track if firing is in progress
    const [error, setError] = useState<Error>(null)

    useEffect(() => {
        if (targetRef.current?.windSpeed !== currentConditions?.windSpeed) {
            setIsFiring(true); // Set firing state to true
            fire().finally(() => setIsFiring(false)); // Reset firing state after fire completes
        }
    }, [currentConditions?.windSpeed]);

    const prefUnit = preferredUnits.velocity;
    const accuracy = useMemo(() => getFractionDigits(0.1, UNew.MPS(1).In(prefUnit)), [prefUnit]);

    const fieldProps: Partial<MeasureFormFieldProps> = {
        label: "Wind speed",
        icon: "windsock",
        fractionDigits: accuracy,
        step: 10 ** -accuracy,
        suffix: UnitProps[prefUnit].symbol,
        minValue: UNew.MPS(0).In(preferredUnits.velocity),
        maxValue: UNew.MPS(100).In(preferredUnits.velocity),
    };

    const value: number = useMemo(() => (
        UNew.MPS(currentConditions?.windSpeed || 0).In(prefUnit)
    ), [currentConditions, prefUnit]);

    const onValueChange = (newValue) => updateCurrentConditions({
        windSpeed: new Velocity(newValue, prefUnit).In(Unit.MPS)
    })

    useEffect(() => {
        updMeasureErr({fkey: fieldProps.fKey, isError: !!error})
    }, [error])

    const spinBoxProps: SpinBoxProps = {
        value: value,
        onValueChange: onValueChange,
        strict: true,
        onError: setError,
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
    };

    return (
        <TouchableValueSelector
            onUp={() => {
                if (!isFiring) onValueChange(value + spinBoxProps.step);
            }}
            onDown={() => {
                if (!isFiring) onValueChange(value - spinBoxProps.step);
            }}
        >
            <DoubleSpinBox {...spinBoxProps} />
        </TouchableValueSelector>
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
})

export { TargetWindSpeedClickable }