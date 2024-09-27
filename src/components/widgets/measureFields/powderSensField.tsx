import { useCallback } from "react";
import { useProfile } from "../../../context/profileContext";
import MeasureFormField, { MeasureFormFieldProps } from "./measureField"
import debounce from "../../../utils/debounce";


export interface PowderSensFieldProps extends Omit<MeasureFormFieldProps, 'value' | 'suffix' | 'onValueChange'> { }


export const PowderSensField: React.FC<PowderSensFieldProps> = () => {
    const { profileProperties, updateProfileProperties } = useProfile();
    const debouncedProfileUpdate = useCallback(debounce(updateProfileProperties, 350), [updateProfileProperties]);

    const fieldProps: Partial<MeasureFormFieldProps> = {
        key: "cTCoeff",
        label: "Temperature sens.",
        suffix: "%/15°C",
        icon: "percent",
        fractionDigits: 2,
        step: 0.01,
        minValue: 0,
        maxValue: 100,
    }

    const value: number = profileProperties ? profileProperties[fieldProps.key] / 1000 : 0

    const onValueChange = (value: number): void => {
        return debouncedProfileUpdate({
            [fieldProps.key]: Math.round(value * 1000)
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
