import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCalculator } from "../../../../context/profileContext";
import { usePreferredUnits } from "../../../../context/preferredUnitsContext";
import { Distance, UNew, Unit, UnitProps } from "js-ballistics/dist/v2";
import { DoubleSpinBox, SpinBoxProps } from "../../../widgets/doubleSpinBox";
import getFractionDigits from "../../../../utils/fractionConvertor";
import { MeasureFormFieldProps } from "../../../widgets/measureFields/measureField";
import { StyleSheet } from "react-native";
import { TouchableValueSelector } from "./touchableSelector";


const TargetRangeClickable = () => {

    const { fire, updMeasureErr, currentConditions, updateCurrentConditions } = useCalculator();
    const { preferredUnits } = usePreferredUnits()

    const targetRef = useRef(currentConditions);

    const [isFiring, setIsFiring] = useState(false); // Track if firing is in progress
    const [error, setError] = useState<Error>(null)
    const errRef = useRef(error)
    
    useEffect(() => {
        if (targetRef.current?.targetDistance !== currentConditions?.targetDistance) {
            setIsFiring(true); // Set firing state to true
            fire().finally(() => setIsFiring(false)); // Reset firing state after fire completes
        }
    }, [currentConditions?.targetDistance]);

    const prefUnit = preferredUnits.distance;
    const accuracy = useMemo(() => getFractionDigits(1, UNew.Meter(1).In(prefUnit)), [prefUnit]);

    const fieldProps: Partial<MeasureFormFieldProps> = {
        fKey: "targetDistance",
        label: "Target distance",
        icon: "target",
        fractionDigits: accuracy,
        step: 10 ** -accuracy * 10,
        suffix: UnitProps[prefUnit].symbol,
        minValue: UNew.Meter(10).In(prefUnit),
        maxValue: UNew.Meter(3000).In(prefUnit),
    };

    const value: number = useMemo(() => (
        UNew.Meter(currentConditions?.[fieldProps.fKey] || 2000).In(prefUnit)
    ), [currentConditions?.[fieldProps.fKey], preferredUnits.distance]);

    const onValueChange = (newValue) => {
        console.log("bchange")
        updateCurrentConditions({
            [fieldProps.fKey]: new Distance(newValue, prefUnit).In(Unit.Meter),
        });
    }
    
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

export { TargetRangeClickable };