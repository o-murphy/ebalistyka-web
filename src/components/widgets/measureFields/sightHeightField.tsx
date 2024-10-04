import { CalculationState, useCalculator } from "../../../context/profileContext";
import { MeasureFormFieldProps, MeasureFormFieldRefreshable } from "./measureField"
import { UNew, Unit, UnitProps, Measure } from "js-ballistics/dist/v2"
import { usePreferredUnits } from "../../../context/preferredUnitsContext";
import getFractionDigits from "../../../utils/fractionConvertor";
import { useEffect, useState } from "react";


export const SightHeightField = () => {
    const { calcState, profileProperties, updateProfileProperties } = useCalculator();
    const { preferredUnits } = usePreferredUnits()

    const [refreshable, setRefreshable] = useState(false)

    useEffect(() => {
        if ([CalculationState.Complete].includes(calcState)) {
            setRefreshable(false)
        }
    }, [calcState]);

    const prefUnit = preferredUnits.sizes
    const accuracy = getFractionDigits(0.1, UNew.Inch(1).In(prefUnit))

    const fieldProps: Partial<MeasureFormFieldProps> = {
        fKey: "scHeight",
        label: "Sight height",
        icon: "crosshairs",
        fractionDigits: accuracy,
        step: 1 / (10 ** accuracy),
        suffix: UnitProps[prefUnit].symbol,
        minValue: UNew.Inch(-5).In(prefUnit),
        maxValue: UNew.Inch(5).In(prefUnit),
    }

    const value: number = UNew.Millimeter(
        profileProperties?.[fieldProps.fKey] ?
            profileProperties[fieldProps.fKey] : 0
    ).In(prefUnit)

    const onValueChange = (value: number): void => {
        updateProfileProperties({
            [fieldProps.fKey]: new Measure.Distance(value, prefUnit).In(Unit.Millimeter)
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
