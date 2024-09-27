import { useCallback } from "react";
import { useProfile } from "../../../context/profileContext";
import MeasureFormField, { MeasureFormFieldProps } from "./measureField"
import { UNew, Unit, UnitProps, preferredUnits, Measure } from "js-ballistics/dist/v2"
import debounce from "../../../utils/debounce";


export interface ZeroTemperatureFieldProps extends Omit<MeasureFormFieldProps, 'value' | 'suffix' | 'onValueChange'> { }


export const ZeroTemperatureField: React.FC<ZeroTemperatureFieldProps> = () => {
    const { profileProperties, updateProfileProperties } = useProfile();
    const debouncedProfileUpdate = useCallback(debounce(updateProfileProperties, 300), [updateProfileProperties]);

    const unitProps = UnitProps[preferredUnits.temperature]

    const fieldProps: Partial<MeasureFormFieldProps> = {
        key: "cZeroAirTemperature",
        label: "Temperature",
        icon: "thermometer",
        fractionDigits: unitProps.accuracy,
        step: 1 / (10 ** unitProps.accuracy),
        suffix: unitProps.symbol,
        minValue: UNew.Celsius(-50).In(preferredUnits.temperature),
        maxValue: UNew.Celsius(50).In(preferredUnits.temperature),
    }

    const value: number = profileProperties ? UNew.Celsius(profileProperties[fieldProps.key]).In(preferredUnits.temperature) : 0

    const onValueChange = (value: number): void => {
        return debouncedProfileUpdate({
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
