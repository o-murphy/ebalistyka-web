import { CalculationState, useCalculator } from "../../../context/profileContext";
import { MeasureFormFieldProps, MeasureFormFieldRefreshable } from "./measureField"
import { UNew, Unit, UnitProps, Measure } from "js-ballistics/dist/v2"
import { usePreferredUnits } from "../../../context/preferredUnitsContext";
import getFractionDigits from "../../../utils/fractionConvertor";
import { useEffect, useState } from "react";


export const MuzzleVelocityField = () => {
    const { calcState, profileProperties, updateProfileProperties } = useCalculator();
    const { preferredUnits } = usePreferredUnits()

    const [refreshable, setRefreshable] = useState(false)

    useEffect(() => {
        if ([CalculationState.Complete].includes(calcState)) {
            setRefreshable(false)
        }
    }, [calcState]);

    const prefUnit = preferredUnits.velocity
    const accuracy = getFractionDigits(1, UNew.MPS(1).In(prefUnit))

    const fieldProps: Partial<MeasureFormFieldProps> = {
        fKey: "cMuzzleVelocity",
        label: "Muzzle velocity",
        icon: "speedometer",
        fractionDigits: accuracy,
        step: 1 / (10 ** accuracy),
        suffix: UnitProps[prefUnit].symbol,
        minValue: UNew.MPS(1.0).In(prefUnit),
        maxValue: UNew.MPS(3000.0).In(prefUnit),
    }

    const value: number = UNew.MPS(
        profileProperties?.[fieldProps.fKey] ? 
        profileProperties[fieldProps.fKey] / 10 : 800
    ).In(prefUnit)

    const onValueChange = (value: number): void => {
        updateProfileProperties({
            [fieldProps.fKey]: new Measure.Velocity(value, preferredUnits.velocity).In(Unit.MPS) * 10
        })
        setRefreshable(true)
    }

    return (
        <MeasureFormFieldRefreshable 
            fieldProps={fieldProps}
            value={value}
            onValueChange={onValueChange}
            refreshable={refreshable}
        />
    )
}
