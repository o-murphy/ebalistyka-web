import { useCallback } from "react";
import { useProfile } from "../../../context/profileContext";
import MeasureFormField, { MeasureFormFieldProps } from "./measureField"
import { UNew, Unit, UnitProps, preferredUnits, Measure } from "js-ballistics/dist/v2"
import debounce from "../../../utils/debounce";


export interface CurrentTemperatureFieldProps extends Omit<MeasureFormFieldProps, 'value' | 'suffix' | 'onValueChange'> { }


export const CurrentTemperatureField: React.FC<CurrentTemperatureFieldProps> = () => {
    const { currentConditions, updateCurrentConditions } = useProfile();
    const debouncedUpdateConditions = useCallback(debounce(updateCurrentConditions, 350), [updateCurrentConditions]);

    const unitProps = UnitProps[preferredUnits.temperature]

    const fieldProps: Partial<MeasureFormFieldProps> = {
        key: "temperature",
        label: "Temperature",
        icon: "thermometer",
        fractionDigits: unitProps.accuracy,
        step: 1 / (10 ** unitProps.accuracy),
        suffix: unitProps.symbol,
        minValue: UNew.Celsius(-50).In(preferredUnits.temperature),
        maxValue: UNew.Celsius(50).In(preferredUnits.temperature),
    }

    const value: number = currentConditions ? UNew.Celsius(currentConditions[fieldProps.key]).In(preferredUnits.temperature) : 0

    const onValueChange = (value: number): void => {
        return debouncedUpdateConditions({
            [fieldProps.key]: Math.round(new Measure.Temperature(value, preferredUnits.temperature).In(Unit.Celsius))
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
