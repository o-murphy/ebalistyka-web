import { CalculationState, useCalculator } from "../../../context/profileContext";
import { MeasureFormFieldProps, MeasureFormFieldRefreshable } from "./measureField"
import { useEffect, useState } from "react";


export const ZeroHumidityField = () => {
    const { calcState, profileProperties, updateProfileProperties } = useCalculator();

    const [refreshable, setRefreshable] = useState(false)
    useEffect(() => {
        if ([CalculationState.Complete].includes(calcState)) {
            setRefreshable(false)
        }
    }, [calcState]);

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

    const value: number = profileProperties?.[fieldProps.fKey] ? profileProperties[fieldProps.fKey] : 0

    const onValueChange = (value: number): void => {
        updateProfileProperties({
            [fieldProps.fKey]: value
        })
        setRefreshable(true)
    }

    return (
        <MeasureFormFieldRefreshable 
            fieldProps={fieldProps}
            value={value}
            onValueChange={onValueChange}
            refreshable={refreshable}
        />
    )
}
