import { CalculationState, useCalculator } from "../../../context/profileContext";
import { MeasureFormFieldProps, MeasureFormFieldRefreshable } from "./measureField"
import { UNew, Unit, UnitProps, Measure } from "js-ballistics/dist/v2"
import { usePreferredUnits } from "../../../context/preferredUnitsContext";
import getFractionDigits from "../../../utils/fractionConvertor";
import { useEffect, useState } from "react";


export const TargetDistance = () => {
    const { calcState, currentConditions, updateCurrentConditions } = useCalculator();

    const { preferredUnits } = usePreferredUnits()

    const prefUnit = preferredUnits.distance
    const accuracy = getFractionDigits(1, UNew.Meter(1).In(prefUnit))

    const [refreshable, setRefreshable] = useState(false)
    useEffect(() => {
        if ([CalculationState.Complete].includes(calcState)) {
            setRefreshable(false)
        }
    }, [calcState]);

    const fieldProps: Partial<MeasureFormFieldProps> = {
        fKey: "targetDistance",
        label: "Target distance",
        icon: "target",
        fractionDigits: accuracy,
        step: 1 / (10 ** accuracy),
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
            [fieldProps.fKey]: new Measure.Distance(value, prefUnit).In(Unit.Meter)
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
