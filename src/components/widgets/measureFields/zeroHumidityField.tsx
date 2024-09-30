import { useCallback } from "react";
import { useProfile } from "../../../context/profileContext";
import MeasureFormField, { MeasureFormFieldProps } from "./measureField"
import { UNew, Unit, UnitProps, preferredUnits, Measure } from "js-ballistics/dist/v2"
import debounce from "../../../utils/debounce";


export interface ZeroHumidityFieldProps extends Omit<MeasureFormFieldProps, 'value' | 'suffix' | 'onValueChange'> { }


export const ZeroHumidityField: React.FC<ZeroHumidityFieldProps> = () => {
    const { profileProperties, updateProfileProperties } = useProfile();
    const debouncedProfileUpdate = useCallback(debounce(updateProfileProperties, 300), [updateProfileProperties]);

    const fieldProps: Partial<MeasureFormFieldProps> = {
        key: "humidity",
        label: "Humidity",
        suffix: "%",
        icon: "water",
        fractionDigits: 0,
        step: 1,
        minValue: 0,
        maxValue: 100,
    }

    const value: number = profileProperties?.[fieldProps.key] ? profileProperties[fieldProps.key] : 0

    const onValueChange = (value: number): void => {
        return debouncedProfileUpdate({
            [fieldProps.key]: Math.round(value)
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
