import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCalculator } from "../../../../context/profileContext";
import { usePreferredUnits } from "../../../../context/preferredUnitsContext";
import { Angular, UNew, Unit, UnitProps } from "js-ballistics/dist/v2";
import { DoubleSpinBox, SpinBoxProps } from "../../doubleSpinBox";
import getFractionDigits from "../../../../utils/fractionConvertor";
import { MeasureFormFieldProps } from "../measureField";
// import debounce from "../../../../utils/debounce";
import { StyleSheet } from "react-native";
import { TouchableValueSelector } from "./touchableSelector";
import useDebouncedValue from "../../../../utils/debounceValue";


const TargetLookAngleClickable = () => {
    const { fire, updMeasureErr, currentConditions, updateCurrentConditions } = useCalculator();
    const { preferredUnits } = usePreferredUnits();
    const targetRef = useRef(currentConditions);

    const [isFiring, setIsFiring] = useState(false); // Track if firing is in progress

    useEffect(() => {
        if (targetRef.current?.lookAngle !== currentConditions?.lookAngle) {
            setIsFiring(true); // Set firing state to true
            fire().finally(() => setIsFiring(false)); // Reset firing state after fire completes
        }
    }, [currentConditions?.lookAngle]);

    const prefUnit = preferredUnits.angular;
    const accuracy = useMemo(() => getFractionDigits(0.1, UNew.Degree(1).In(prefUnit)), [prefUnit]);

    const fieldProps: Partial<MeasureFormFieldProps> = {
        label: "Look angle",
        icon: "angle-acute",
        fractionDigits: accuracy,
        step: 1 / (10 ** accuracy),
        suffix: UnitProps[prefUnit].symbol,
        minValue: UNew.Degree(-90).In(prefUnit),
        maxValue: UNew.Degree(90).In(prefUnit),
    };

    const value: number = useMemo(() => (
        UNew.Degree(currentConditions?.lookAngle || 0).In(prefUnit)
    ), [currentConditions?.lookAngle, prefUnit]);

    const [debouncedValue, setDebouncedValue] = useDebouncedValue(value, 500, (newValue) => {
        updateCurrentConditions({
            "lookAngle": new Angular(newValue, prefUnit).In(Unit.Degree),
        });
    });

    const onErrorSet = useCallback((error: Error) => {
        updMeasureErr({ fkey: fieldProps.fKey, isError: !!error });
    }, [fieldProps.fKey, updMeasureErr]);

    const spinBoxProps: SpinBoxProps  = {
        value: debouncedValue,
        onValueChange: setDebouncedValue,
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
                if (!isFiring) setDebouncedValue(debouncedValue + spinBoxProps.step);
            }}
            onDown={() => {
                if (!isFiring) setDebouncedValue(debouncedValue - spinBoxProps.step);
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

export { TargetLookAngleClickable }