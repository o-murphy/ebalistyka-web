import { CalculationState, useCalculator } from "../../../context/profileContext";
import { MeasureFormFieldProps, MeasureFormFieldRefreshable } from "./measureField"
import { UNew, Unit, UnitProps, Measure } from "js-ballistics/dist/v2"
import { usePreferredUnits } from "../../../context/preferredUnitsContext";
import getFractionDigits from "../../../utils/fractionConvertor";
import { useCallback, useEffect, useMemo, useState } from "react";


export const ZeroPressureField = () => {
    const { calcState, profileProperties, updateProfileProperties } = useCalculator();
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
        fKey: "cZeroAirPressure",
        label: "Pressure",
        icon: "speedometer",
        fractionDigits: accuracy,
        step: 1 / (10 ** accuracy),
        suffix: UnitProps[prefUnit].symbol,
        minValue: UNew.hPa(500).In(prefUnit),
        maxValue: UNew.hPa(1300).In(prefUnit),
    }), [accuracy, prefUnit])

    const value: number = useMemo(() => UNew.hPa(
        profileProperties?.cZeroAirPressure ?
            profileProperties.cZeroAirPressure / 10 : 1000
    ).In(prefUnit), [profileProperties?.cZeroAirPressure, prefUnit])

    const onValueChange = useCallback((value: number): void => {
        updateProfileProperties({
            cZeroAirPressure: new Measure.Pressure(value, prefUnit).In(Unit.hPa) * 10
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
