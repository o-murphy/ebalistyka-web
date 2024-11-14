import { CalculationState, useProfile } from "../../../context/profileContext";
import { MeasureFormFieldProps, MeasureFormFieldRefreshable } from "./measureField"
import { UNew, Unit, UnitProps, Measure } from "js-ballistics/dist/v2"
import { usePreferredUnits } from "../../../context/preferredUnitsContext";
import getFractionDigits from "../../../utils/fractionConvertor";
import { useEffect, useState } from "react";


export const BulletWeightField = () => {
    const { calcState, profileProperties, updateProfileProperties } = useProfile();
    const { preferredUnits } = usePreferredUnits()

    const [refreshable, setRefreshable] = useState(false)
    useEffect(() => {
        if (calcState === CalculationState.Complete) {
            setRefreshable(false)
        }
    }, [calcState]);

    const prefUnit = preferredUnits.weight
    const accuracy = getFractionDigits(0.1, UNew.Grain(1).In(prefUnit))

    const fieldProps: Partial<MeasureFormFieldProps> = {
        fKey: "bWeight",
        label: "Weight",
        icon: "weight",
        fractionDigits: accuracy,
        step: 1 / (10 ** accuracy),
        suffix: UnitProps[prefUnit].symbol,
        minValue: UNew.Grain(1).In(prefUnit),
        maxValue: UNew.Grain(6553.5).In(prefUnit),
    }

    const value: number = UNew.Grain(
        profileProperties?.[fieldProps.fKey] ? 
        profileProperties[fieldProps.fKey] / 10 : 
        300
    ).In(prefUnit)
    
    const onValueChange = (value: number): void => {
        updateProfileProperties({
            [fieldProps.fKey]: new Measure.Weight(value, prefUnit).In(Unit.Grain) * 10
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
