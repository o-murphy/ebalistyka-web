import { useCallback } from "react";
import { useProfile } from "../../../context/profileContext";
import MeasureFormField, { MeasureFormFieldProps } from "./measureField"
import { UNew, Unit, UnitProps, Measure } from "js-ballistics/dist/v2"
import debounce from "../../../utils/debounce";
import { usePreferredUnits } from "../../../context/preferredUnitsContext";
import getFractionDigits from "../../../utils/fractionConvertor";

export interface CurrentTemperatureFieldProps extends Omit<MeasureFormFieldProps, 'value' | 'suffix' | 'onValueChange'> { }


export const CurrentTemperatureField: React.FC<CurrentTemperatureFieldProps> = () => {
    const { currentConditions, updateCurrentConditions } = useProfile();
    const debouncedUpdateConditions = useCallback(debounce(updateCurrentConditions, 350), [updateCurrentConditions]);

    const { preferredUnits } = usePreferredUnits()

    const prefUnit = preferredUnits.temperature
    const accuracy = getFractionDigits(1, UNew.Celsius(1).In(prefUnit))

    const fieldProps: Partial<MeasureFormFieldProps> = {
        key: "temperature",
        label: "Temperature",
        icon: "thermometer",
        fractionDigits: accuracy,
        step: 1 / (10 ** accuracy),
        suffix: UnitProps[prefUnit].symbol,
        minValue: UNew.Celsius(-50).In(prefUnit),
        maxValue: UNew.Celsius(50).In(prefUnit),
    }

    const value: number = currentConditions ? UNew.Celsius(currentConditions[fieldProps.key]).In(prefUnit) : 0

    const onValueChange = (value: number): void => {
        return debouncedUpdateConditions({
            [fieldProps.key]: new Measure.Temperature(value, prefUnit).In(Unit.Celsius)
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
