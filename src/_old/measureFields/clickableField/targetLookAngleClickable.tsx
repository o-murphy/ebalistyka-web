import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useProfile } from "../../../../context/profileContext";
import { usePreferredUnits } from "../../../../context/preferredUnitsContext";
import { Angular, UNew, Unit, UnitProps } from "js-ballistics";
import { DoubleSpinBox, SpinBoxProps } from "../../doubleSpinBox";
import getFractionDigits from "../../../../utils/fractionConvertor";
import { MeasureFormFieldProps } from "../measureField";
import { StyleSheet } from "react-native";
import { TouchableValueSelector } from "./touchableSelector";


const TargetLookAngleClickable = () => {
    const { fire, updMeasureErr, currentConditions, updateCurrentConditions } = useProfile();
    const { preferredUnits } = usePreferredUnits();
    const targetRef = useRef(currentConditions);

    const [isFiring, setIsFiring] = useState(false); // Track if firing is in progress
    const [error, setError] = useState<Error>(null)

    useEffect(() => {
        if (targetRef.current?.lookAngle !== currentConditions?.lookAngle) {
            setIsFiring(true); // Set firing state to true
            fire().finally(() => setIsFiring(false)); // Reset firing state after fire completes
        }
    }, [currentConditions?.lookAngle]);

    const prefUnit = preferredUnits.angular;
    const accuracy = useMemo(() => getFractionDigits(0.1, UNew.Degree(1).In(prefUnit)), [prefUnit]);

    const fieldProps: Partial<MeasureFormFieldProps> = {
        fKey: "lookAngle",
        label: "Look angle",
        icon: "angle-acute",
        fractionDigits: accuracy,
        step: 1 / (10 ** accuracy),
        suffix: UnitProps[prefUnit].symbol,
        minValue: UNew.Degree(-90).In(prefUnit),
        maxValue: UNew.Degree(90).In(prefUnit),
    };

    const value: number = useMemo(() => (
        UNew.Degree(currentConditions?.[fieldProps.fKey] || 0).In(prefUnit)
    ), [currentConditions?.[fieldProps.fKey], prefUnit]);

    const onValueChange = (newValue) => {
        updateCurrentConditions({
            [fieldProps.fKey]: new Angular(newValue, prefUnit).In(Unit.Degree),
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

export { TargetLookAngleClickable }