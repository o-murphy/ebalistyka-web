import { CalculationState, useCalculator } from "../../../context/profileContext";
import { MeasureFormFieldProps, MeasureFormFieldRefreshable } from "./measureField"
import { UNew, Unit, UnitProps, Measure } from "js-ballistics/dist/v2"
import { usePreferredUnits } from "../../../context/preferredUnitsContext";
import getFractionDigits from "../../../utils/fractionConvertor";
import { useCallback, useEffect, useMemo, useState } from "react";


export const ZeroTemperatureField = () => {
    const { calcState, profileProperties, updateProfileProperties } = useCalculator();
    const { preferredUnits } = usePreferredUnits()

    const [refreshable, setRefreshable] = useState(false)
    useEffect(() => {
        if (calcState === CalculationState.Complete) {
            setRefreshable(false)
        }
    }, [calcState]);

    const prefUnit = useMemo(() => preferredUnits.temperature, [preferredUnits.temperature])
    const accuracy = useMemo(() => getFractionDigits(1, UNew.Celsius(1).In(prefUnit)), [prefUnit])

    const fieldProps: Partial<MeasureFormFieldProps> = useMemo(() => ({
        fKey: "cZeroAirTemperature",
        label: "Temperature",
        icon: "thermometer",
        fractionDigits: accuracy,
        step: 1 / (10 ** accuracy),
        suffix: UnitProps[prefUnit].symbol,
        minValue: UNew.Celsius(-50).In(prefUnit),
        maxValue: UNew.Celsius(50).In(prefUnit),
    }), [accuracy, prefUnit])

    const value: number = useMemo(() => UNew.Celsius(
        profileProperties?.cZeroAirTemperature ?
            profileProperties.cZeroAirTemperature : 15
    ).In(prefUnit), [profileProperties?.cZeroAirTemperature, prefUnit])

    const onValueChange = useCallback((value: number): void => {
        updateProfileProperties({
            cZeroAirTemperature: new Measure.Temperature(value, prefUnit).In(Unit.Celsius)
        })
        setRefreshable(true)
    }, [updateProfileProperties, prefUnit]);

    return (
        <MeasureFormFieldRefreshable
            fieldProps={fieldProps}
            value={value}
            onValueChange={onValueChange}
            refreshable={refreshable}
        />
    )
}
