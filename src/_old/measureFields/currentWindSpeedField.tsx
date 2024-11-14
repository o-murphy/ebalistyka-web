import { CalculationState, useProfile } from "../../../context/profileContext";
import { MeasureFormFieldProps, MeasureFormFieldRefreshable } from "./measureField"
import { UNew, Unit, UnitProps, Measure } from "js-ballistics/dist/v2"
import { usePreferredUnits } from "../../../context/preferredUnitsContext";
import getFractionDigits from "../../../utils/fractionConvertor";
import { useCallback, useEffect, useMemo, useState } from "react";


export const WindSpeedField = () => {
    const { calcState, currentConditions, updateCurrentConditions } = useProfile();

    const { preferredUnits } = usePreferredUnits()

    const [refreshable, setRefreshable] = useState(false)

    useEffect(() => {
        if (calcState === CalculationState.Complete) {
            setRefreshable(false)
        }
    }, [calcState]);

    const prefUnit = useMemo(() => preferredUnits.velocity, [preferredUnits.velocity])
    const accuracy = useMemo(() => getFractionDigits(0.1, UNew.MPS(1).In(prefUnit)), [prefUnit])

    const fieldProps: Partial<MeasureFormFieldProps> = useMemo(() => ({
        fKey: "windSpeed",
        label: "Wind speed",
        icon: "windsock",
        fractionDigits: accuracy,
        step: 10 ** -accuracy,
        suffix: UnitProps[prefUnit].symbol,
        minValue: UNew.MPS(0).In(preferredUnits.velocity),
        maxValue: UNew.MPS(100).In(preferredUnits.velocity),
    }), [accuracy, prefUnit])

    const value: number = useMemo(() => UNew.MPS(
        currentConditions?.windSpeed ? 
        currentConditions.windSpeed : 0
    ).In(prefUnit), [currentConditions?.windSpeed, prefUnit])

    const onValueChange = useCallback((value: number): void => {
        updateCurrentConditions({
            windSpeed: new Measure.Velocity(value, prefUnit).In(Unit.MPS)
        })
        setRefreshable(true)
    }, [currentConditions, prefUnit]);

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
