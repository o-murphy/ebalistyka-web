import { useCallback } from "react";
import { useProfile } from "../../../context/profileContext";
import MeasureFormField, { MeasureFormFieldProps } from "./measureField"
import { UNew, Unit, UnitProps, preferredUnits, Measure } from "js-ballistics/dist/v2"
import debounce from "../../../utils/debounce";


export interface WindSpeedFieldProps extends Omit<MeasureFormFieldProps, 'value' | 'suffix' | 'onValueChange'> { }


export const WindSpeedField: React.FC<WindSpeedFieldProps> = () => {
    const { currentConditions, updateCurrentConditions } = useProfile();
    const debouncedUpdateConditions = useCallback(debounce(updateCurrentConditions, 350), [updateCurrentConditions]);

    const unitProps = UnitProps[preferredUnits.velocity]

    const fieldProps: Partial<MeasureFormFieldProps> = {
        key: "windSpeed",
        label: "Wind speed",
        icon: "windsock",
        fractionDigits: unitProps.accuracy,
        step: 1 / (10 ** unitProps.accuracy),
        suffix: unitProps.symbol,
        minValue: UNew.MPS(0).In(preferredUnits.velocity),
        maxValue: UNew.MPS(100).In(preferredUnits.velocity),
    }

    const value: number = currentConditions ? UNew.MPS(currentConditions[fieldProps.key]).In(preferredUnits.velocity) : 0

    const onValueChange = (value: number): void => {
        return debouncedUpdateConditions({
            [fieldProps.key]: Math.round(new Measure.Velocity(value, preferredUnits.velocity).In(Unit.MPS))
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
