import { CalculationState, useCalculator } from "../../../context/profileContext";
import { MeasureFormFieldProps, MeasureFormFieldRefreshable } from "./measureField"
import { UNew, Unit, UnitProps, Measure } from "js-ballistics/dist/v2"
import { usePreferredUnits } from "../../../context/preferredUnitsContext";
import getFractionDigits from "../../../utils/fractionConvertor";
import { useCallback, useEffect, useMemo, useState } from "react";

export const CurrentPressureField = () => {
    const { calcState, currentConditions, updateCurrentConditions } = useCalculator();

    const { preferredUnits } = usePreferredUnits()

    const [refreshable, setRefreshable] = useState(false)

    useEffect(() => {
        if (calcState === CalculationState.Complete) {
            setRefreshable(false)
        }
    }, [calcState]);

    const prefUnit = useMemo(() => preferredUnits.pressure, [preferredUnits.pressure])
    const accuracy = useMemo(() => getFractionDigits(1, UNew.hPa(1).In(prefUnit)), [prefUnit])

    const fieldProps: Partial<MeasureFormFieldProps> = useMemo(() => ({
        fKey: "pressure",
        label: "Pressure",
        icon: "gauge",
        fractionDigits: accuracy,
        step: 1 / (10 ** accuracy),
        suffix: UnitProps[prefUnit].symbol,
        minValue: UNew.hPa(500).In(prefUnit),
        maxValue:UNew.hPa(1300).In(prefUnit),
    }), [accuracy, prefUnit])

    const value: number = useMemo(() => UNew.hPa(
        currentConditions?.pressure ? 
        currentConditions.pressure : 1000
    ).In(prefUnit), [currentConditions?.pressure, prefUnit])

    const onValueChange = useCallback((value: number): void => {
        updateCurrentConditions({
            pressure: new Measure.Pressure(value, prefUnit).In(Unit.hPa)
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
