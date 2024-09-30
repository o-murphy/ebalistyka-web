import { useCallback } from "react";
import { useProfile } from "../../../context/profileContext";
import MeasureFormField, { MeasureFormFieldProps } from "./measureField"
import debounce from "../../../utils/debounce";


export interface CurrentHumidityFieldProps extends Omit<MeasureFormFieldProps, 'value' | 'suffix' | 'onValueChange'> { }


export const CurrentHumidityField: React.FC<CurrentHumidityFieldProps> = () => {
    const { currentConditions, updateCurrentConditions } = useProfile();
    const debouncedUpdateConditions = useCallback(debounce(updateCurrentConditions, 350), [updateCurrentConditions]);

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

    const value: number = currentConditions?.[fieldProps.key] ? currentConditions[fieldProps.key] : 0

    const onValueChange = (value: number): void => {
        return debouncedUpdateConditions({
            [fieldProps.key]: value
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
