import { CalculationState, useCalculator } from "../../../context/profileContext";
import { MeasureFormFieldProps, MeasureFormFieldRefreshable } from "./measureField"
import { UNew, UnitProps } from "js-ballistics/dist/v2"
import { usePreferredUnits } from "../../../context/preferredUnitsContext";
import { useEffect, useState } from "react";


export const PowderSensField = () => {
    const { calcState, profileProperties, updateProfileProperties } = useCalculator();
    const { preferredUnits } = usePreferredUnits()

    const [refreshable, setRefreshable] = useState(false)
    useEffect(() => {
        if ([CalculationState.Complete].includes(calcState)) {
            setRefreshable(false)
        }
    }, [calcState]);

    const prefUnits = preferredUnits.temperature
    const label = `Temperature sens. (%/${UNew.Celsius(15).In(prefUnits)}${UnitProps[prefUnits].symbol})`

    const fieldProps: Partial<MeasureFormFieldProps> = {
        fKey: "cTCoeff",
        label: label,
        suffix: "%",
        icon: "percent",
        fractionDigits: 2,
        step: 0.01,
        minValue: 0,
        maxValue: 100,
    }

    const value: number = profileProperties?.[fieldProps.fKey] ? profileProperties[fieldProps.fKey] / 1000 : 0

    const onValueChange = (value: number): void => {
        updateProfileProperties({
            [fieldProps.fKey]: value * 1000
        })
        setRefreshable(true)
    }

    return (
        <MeasureFormFieldRefreshable 
            fieldProps={fieldProps}
            value={value}
            onValueChange={onValueChange}
            refreshable={refreshable}
        />
    )
}
