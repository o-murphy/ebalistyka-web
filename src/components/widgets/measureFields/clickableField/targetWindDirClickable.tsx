import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCalculator } from "../../../../context/profileContext";
import { UNew, Unit, UnitProps } from "js-ballistics/dist/v2";
import { DoubleSpinBox, SpinBoxProps } from "../../doubleSpinBox";
import getFractionDigits from "../../../../utils/fractionConvertor";
import { MeasureFormFieldProps } from "../measureField";
import { StyleSheet } from "react-native";
import { TouchableValueSelector } from "./touchableSelector";


const TargetWindDirClickable = () => {
    const { fire, updMeasureErr, currentConditions, updateCurrentConditions } = useCalculator();
    const targetRef = useRef(currentConditions);

    const [isFiring, setIsFiring] = useState(false); // Track if firing is in progress

    useEffect(() => {
        if (targetRef.current?.windDirection !== currentConditions?.windDirection) {
            setIsFiring(true); // Set firing state to true
            fire().finally(() => setIsFiring(false)); // Reset firing state after fire completes
        }
    }, [currentConditions?.windDirection]);

    const prefUnit = Unit.Degree;
    const accuracy = useMemo(() => getFractionDigits(1, UNew.Degree(1).In(prefUnit)), [prefUnit]);

    const fieldProps: Partial<MeasureFormFieldProps> = {
        fKey: "windDirection",
        label: "Wind direction",
        icon: "windsock",
        fractionDigits: accuracy,
        step: 30,
        suffix: UnitProps[prefUnit].symbol,
        minValue: 0,
        maxValue: 360,
    };

    const value: number = useMemo(() => (
        UNew.Degree(currentConditions?.windDirection ? currentConditions.windDirection * fieldProps.step : 0).In(prefUnit)
    ), [currentConditions]);

    const onValueChange = (newValue) => {
        updateCurrentConditions({
            windDirection: newValue / fieldProps.step
        });
    };

    const onErrorSet = useCallback((error: Error) => {
        updMeasureErr({ fkey: "windDirection", isError: !!error });
    }, [updMeasureErr]);

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

export { TargetWindDirClickable }