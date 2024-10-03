import { CalculationState, useCalculator } from "../../../context/profileContext";
import { MeasureFormFieldProps, MeasureFormFieldRefreshable } from "./measureField"
import { UNew, Unit, UnitProps, Measure } from "js-ballistics/dist/v2"
import { usePreferredUnits } from "../../../context/preferredUnitsContext";
import getFractionDigits from "../../../utils/fractionConvertor";
import { useEffect, useState } from "react";


export const WindSpeedField = () => {
    const { calcState, currentConditions, updateCurrentConditions } = useCalculator();

    const { preferredUnits } = usePreferredUnits()

    const [refreshable, setRefreshable] = useState(false)

    useEffect(() => {
        if (calcState === CalculationState.Complete) {
            setRefreshable(false)
        }
    }, [calcState]);

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
            [fieldProps.fKey]: new Measure.Velocity(value, prefUnit).In(Unit.MPS)
        })
        setRefreshable(true)
    }

    return (
        <MeasureFormFieldRefreshable 
            fieldProps={fieldProps}
            value={value}
            onValueChange={onValueChange}
            refreshable={refreshable}
            buttonPosition="left"
        />
    )
}
