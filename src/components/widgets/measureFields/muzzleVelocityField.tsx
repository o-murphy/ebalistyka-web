import { CalculationState, useCalculator } from "../../../context/profileContext";
import { MeasureFormFieldProps, MeasureFormFieldRefreshable } from "./measureField"
import { UNew, Unit, UnitProps, Measure } from "js-ballistics/dist/v2"
import { usePreferredUnits } from "../../../context/preferredUnitsContext";
import getFractionDigits from "../../../utils/fractionConvertor";
import { useCallback, useEffect, useMemo, useState } from "react";


export const MuzzleVelocityField = () => {
    const { calcState, profileProperties, updateProfileProperties } = useCalculator();
    const { preferredUnits } = usePreferredUnits()

    const [refreshable, setRefreshable] = useState(false)

    useEffect(() => {
        if (calcState === CalculationState.Complete) {
            setRefreshable(false)
        }
    }, [calcState]);

    const prefUnit = useMemo(() => preferredUnits.velocity, [preferredUnits.velocity])
    const accuracy = useMemo(() => getFractionDigits(1, UNew.MPS(1).In(prefUnit)), [prefUnit])

    const fieldProps: Partial<MeasureFormFieldProps> = useMemo(() => ({
        fKey: "cMuzzleVelocity",
        label: "Muzzle velocity",
        icon: "speedometer",
        fractionDigits: accuracy,
        step: 1 / (10 ** accuracy),
        suffix: UnitProps[prefUnit].symbol,
        minValue: UNew.MPS(1.0).In(prefUnit),
        maxValue: UNew.MPS(3000.0).In(prefUnit),
    }), [accuracy, prefUnit])

    const value: number = useMemo(() => UNew.MPS(
        profileProperties?.cMuzzleVelocity ? 
        profileProperties.cMuzzleVelocity / 10 : 800
    ).In(prefUnit), [profileProperties?.cMuzzleVelocity, prefUnit])

    const onValueChange = useCallback((value: number): void => {
        updateProfileProperties({
            cMuzzleVelocity: new Measure.Velocity(value, preferredUnits.velocity).In(Unit.MPS) * 10
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
