import { useCallback } from "react";
import { useProfile } from "../../../context/profileContext";
import MeasureFormField, { MeasureFormFieldProps } from "./measureField"
import { UNew, Unit, UnitProps, Measure } from "js-ballistics/dist/v2"
import debounce from "../../../utils/debounce";
import { usePreferredUnits } from "../../../context/preferredUnitsContext";
import getFractionDigits from "../../../utils/fractionConvertor";

export interface WindSpeedFieldProps extends Omit<MeasureFormFieldProps, 'value' | 'suffix' | 'onValueChange'> { }


export const WindSpeedField: React.FC<WindSpeedFieldProps> = () => {
    const { currentConditions, updateCurrentConditions } = useProfile();
    const debouncedUpdateConditions = useCallback(debounce(updateCurrentConditions, 350), [updateCurrentConditions]);

    const { preferredUnits } = usePreferredUnits()

    const prefUnit = preferredUnits.velocity
    const accuracy = getFractionDigits(0.1, UNew.MPS(1).In(prefUnit))

    const fieldProps: Partial<MeasureFormFieldProps> = {
        key: "windSpeed",
        label: "Wind speed",
        icon: "windsock",
        fractionDigits: accuracy,
        step: 1 / (10 ** accuracy),
        suffix: UnitProps[prefUnit].symbol,
        minValue: UNew.MPS(0).In(prefUnit),
        maxValue: UNew.MPS(100).In(prefUnit),
    }

    const value: number = UNew.MPS(
        currentConditions?.[fieldProps.key] ? 
        currentConditions[fieldProps.key] : 0
    ).In(prefUnit)

    const onValueChange = (value: number): void => {
        return debouncedUpdateConditions({
            [fieldProps.key]: new Measure.Velocity(value, prefUnit).In(Unit.MPS)
        })
    }

    return (
        <MeasureFormField
        {...fieldProps}
        value={value}
        onValueChange={onValueChange}
    />
    )
}
