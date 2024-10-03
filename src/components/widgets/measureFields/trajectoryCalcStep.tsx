import { CalculationState, useCalculator } from "../../../context/profileContext";
import { MeasureFormFieldProps, MeasureFormFieldRefreshable } from "./measureField"
import { UNew, Unit, UnitProps, Measure } from "js-ballistics/dist/v2"
import { usePreferredUnits } from "../../../context/preferredUnitsContext";
import getFractionDigits from "../../../utils/fractionConvertor";
import { useEffect, useState } from "react";


export const TrajectoryStepField = () => {
    const { calcState, currentConditions, updateCurrentConditions } = useCalculator();

    const { preferredUnits } = usePreferredUnits()

    const [refreshable, setRefreshable] = useState(false)

    useEffect(() => {
        if ([CalculationState.Complete].includes(calcState)) {
            setRefreshable(false)
        }
    }, [calcState]);

    const prefUnit = preferredUnits.distance
    const accuracy = getFractionDigits(1, UNew.Meter(1).In(prefUnit))

    const fieldProps: Partial<MeasureFormFieldProps> = {
        fKey: "trajectoryStep",
        label: "Trajectory step",
        icon: "delta",
        fractionDigits: accuracy,
        // step: 1 / (10 ** accuracy),
        step: 10,
        suffix: UnitProps[prefUnit].symbol,
        minValue: UNew.Meter(10).In(prefUnit),
        maxValue: UNew.Meter(500).In(prefUnit),
    }

    const value: number = UNew.Meter(
        currentConditions?.[fieldProps.fKey] ? 
        currentConditions[fieldProps.fKey] : 100
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
