import { CalculationState, useProfile } from "../../../context/profileContext";
import { MeasureFormFieldProps, MeasureFormFieldRefreshable } from "./measureField"
import { useCallback, useEffect, useMemo, useState } from "react";


export const CurrentHumidityField = () => {
    const { calcState, currentConditions, updateCurrentConditions } = useProfile();

    const [refreshable, setRefreshable] = useState(false)

    useEffect(() => {
        if (calcState === CalculationState.Complete) {
            setRefreshable(false)
        }
    }, [calcState]);

    const fieldProps: Partial<MeasureFormFieldProps> = useMemo(() => ({
        fKey: "humidity",
        label: "Humidity",
        suffix: "%",
        icon: "water",
        fractionDigits: 0,
        step: 1,
        minValue: 0,
        maxValue: 100,
    }), [])

    const value: number = useMemo(
        () => currentConditions?.humidity ? currentConditions.humidity : 0,
    [currentConditions?.humidity])

    const onValueChange = useCallback((value: number): void => {
        updateCurrentConditions({
            humidity: value
        })
        setRefreshable(true)
    }, [currentConditions]);

    return (
        <MeasureFormFieldRefreshable 
            fieldProps={fieldProps}
            value={value}
            onValueChange={onValueChange}
            refreshable={refreshable}
            buttonPosition="left"
        />
    )
}
