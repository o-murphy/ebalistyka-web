import { CalculationState, useCalculator } from "../../../context/profileContext";
import { MeasureFormFieldProps, MeasureFormFieldRefreshable } from "./measureField"
import { UNew, Unit, UnitProps, Measure } from "js-ballistics/dist/v2"
import { usePreferredUnits } from "../../../context/preferredUnitsContext";
import getFractionDigits from "../../../utils/fractionConvertor";
import { useEffect, useState } from "react";

export const CurrentPressureField = () => {
    const { calcState, currentConditions, updateCurrentConditions } = useCalculator();

    const { preferredUnits } = usePreferredUnits()

    const [refreshable, setRefreshable] = useState(false)

    useEffect(() => {
        if ([CalculationState.Complete].includes(calcState)) {
            setRefreshable(false)
        }
    }, [calcState]);

    const prefUnit = preferredUnits.pressure
    const accuracy = getFractionDigits(1, UNew.hPa(1).In(prefUnit))

    const fieldProps: Partial<MeasureFormFieldProps> = {
        fKey: "pressure",
        label: "Pressure",
        icon: "speedometer",
        fractionDigits: accuracy,
        step: 1 / (10 ** accuracy),
        suffix: UnitProps[prefUnit].symbol,
        minValue: UNew.hPa(500).In(prefUnit),
        maxValue:UNew.hPa(1300).In(prefUnit),
    }

    const value: number = UNew.hPa(
        currentConditions?.[fieldProps.fKey] ? 
        currentConditions[fieldProps.fKey] : 1000
    ).In(prefUnit)

    const onValueChange = (value: number): void => {
        updateCurrentConditions({
            [fieldProps.fKey]: new Measure.Pressure(value, prefUnit).In(Unit.hPa)
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
