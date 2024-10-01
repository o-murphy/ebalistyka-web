import { useEffect } from "react";
import { useProfile } from "../../../context/profileContext";
import MeasureFormField, { MeasureFormFieldProps } from "./measureField"


export interface CurrentHumidityFieldProps extends Omit<MeasureFormFieldProps, 'value' | 'suffix' | 'onValueChange'> { }


export const CurrentHumidityField: React.FC<CurrentHumidityFieldProps> = () => {
    const { currentConditions, updateCurrentConditions } = useProfile();

    const fieldProps: Partial<MeasureFormFieldProps> = {
        fKey: "humidity",
        label: "Humidity",
        suffix: "%",
        icon: "water",
        fractionDigits: 0,
        step: 1,
        minValue: 0,
        maxValue: 100,
    }

    const value: number = currentConditions?.[fieldProps.fKey] ? currentConditions[fieldProps.fKey] : 0

    const onValueChange = (value: number): void => {
        return updateCurrentConditions({
            [fieldProps.fKey]: value
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
