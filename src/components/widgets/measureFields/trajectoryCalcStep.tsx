import { CalculationState, useProfile } from "../../../context/profileContext";
import { MeasureFormFieldProps, MeasureFormFieldRefreshable } from "./measureField"
import { UNew, Unit, UnitProps, Measure } from "js-ballistics/dist/v2"
import { usePreferredUnits } from "../../../context/preferredUnitsContext";
import getFractionDigits from "../../../utils/fractionConvertor";
import { useCallback, useEffect, useMemo, useState } from "react";


export const TrajectoryStepField = () => {
    const { calcState, currentConditions, updateCurrentConditions } = useProfile();

    const { preferredUnits } = usePreferredUnits()

    const [refreshable, setRefreshable] = useState(false)

    useEffect(() => {
        if ([CalculationState.Complete].includes(calcState)) {
            setRefreshable(false)
        }
    }, [calcState]);

    const prefUnit = useMemo(() => preferredUnits.distance, [preferredUnits.distance])
    const accuracy = useMemo(() => getFractionDigits(1, UNew.Meter(1).In(prefUnit)), [prefUnit])

    const fieldProps: Partial<MeasureFormFieldProps> = useMemo(() => ({
        fKey: "trajectoryStep",
        label: "Trajectory step",
        icon: "delta",
        fractionDigits: accuracy,
        // step: 1 / (10 ** accuracy),
        step: 10,
        suffix: UnitProps[prefUnit].symbol,
        minValue: UNew.Meter(10).In(prefUnit),
        maxValue: UNew.Meter(500).In(prefUnit),
    }), [accuracy, prefUnit])

    const value: number = useMemo(() => UNew.Meter(
        currentConditions?.trajectoryStep ? 
        currentConditions.trajectoryStep : 100
    ).In(prefUnit), [currentConditions?.trajectoryStep, prefUnit])

    const onValueChange = useCallback((value: number): void => {
        updateCurrentConditions({
            trajectoryStep: new Measure.Distance(value, prefUnit).In(Unit.Meter)
        })
        setRefreshable(true)
    }, [updateCurrentConditions, prefUnit]);

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
