import { CalculationState, useCalculator } from "../../../context/profileContext";
import { MeasureFormFieldProps, MeasureFormFieldRefreshable } from "./measureField"
import { UNew, UnitProps } from "js-ballistics/dist/v2"
import { usePreferredUnits } from "../../../context/preferredUnitsContext";
import { useCallback, useEffect, useMemo, useState } from "react";
import getFractionDigits from "../../../utils/fractionConvertor";


export const PowderSensField = () => {
    const { calcState, profileProperties, updateProfileProperties } = useCalculator();
    const { preferredUnits } = usePreferredUnits()

    const [refreshable, setRefreshable] = useState(false)
    useEffect(() => {
        if ([CalculationState.Complete].includes(calcState)) {
            setRefreshable(false)
        }
    }, [calcState]);

    const prefUnit = useMemo(() => preferredUnits.temperature, [preferredUnits.temperature])
    const accuracy = useMemo(() => getFractionDigits(1, UNew.Celsius(1).In(prefUnit)), [prefUnit])
    const label = useMemo(() => `Temperature sens. (%/${UNew.Celsius(15).In(prefUnit)}${UnitProps[prefUnit].symbol})`, [prefUnit])

    const fieldProps: Partial<MeasureFormFieldProps> = useMemo(() => ({
        fKey: "cTCoeff",
        label: label,
        suffix: "%",
        icon: "percent",
        fractionDigits: 2,
        step: 0.01,
        minValue: 0,
        maxValue: 100,
    }), [accuracy, prefUnit])

    const value: number = useMemo(
        () => profileProperties?.cTCoeff ? profileProperties.cTCoeff / 1000 : 0, 
    [profileProperties?.cTCoeff, prefUnit])

    const onValueChange = useCallback((value: number): void => {
        updateProfileProperties({
            cTCoeff: value * 1000
        })
        setRefreshable(true)
    }, [profileProperties, prefUnit]);

    return (
        <MeasureFormFieldRefreshable 
            fieldProps={fieldProps}
            value={value}
            onValueChange={onValueChange}
            refreshable={refreshable}
        />
    )
}
