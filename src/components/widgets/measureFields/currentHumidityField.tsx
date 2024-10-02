import { useEffect } from "react";
import { useCalculator } from "../../../context/profileContext";
import MeasureFormField, { MeasureFormFieldProps } from "./measureField"


export const CurrentHumidityField = () => {
    const { currentConditions, updateCurrentConditions } = useCalculator();

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
