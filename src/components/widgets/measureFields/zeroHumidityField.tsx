import { CalculationState, useCalculator } from "../../../context/profileContext";
import { MeasureFormFieldProps, MeasureFormFieldRefreshable } from "./measureField"
import { useCallback, useEffect, useMemo, useState } from "react";


export const ZeroHumidityField = () => {
    const { calcState, profileProperties, updateProfileProperties } = useCalculator();

    const [refreshable, setRefreshable] = useState(false)
    useEffect(() => {
        if (calcState === CalculationState.Complete) {
            setRefreshable(false)
        }
    }, [calcState]);

    const fieldProps: Partial<MeasureFormFieldProps> = {
        fKey: "cZeroAirHumidity",
        label: "Humidity",
        suffix: "%",
        icon: "water",
        fractionDigits: 0,
        step: 1,
        minValue: 0,
        maxValue: 100,
    }

    const value: number = useMemo(
        () => profileProperties?.cZeroAirHumidity ? profileProperties.cZeroAirHumidity : 0,
        [profileProperties?.cZeroAirHumidity])

    const onValueChange = useCallback((value: number): void => {
        updateProfileProperties({
            [fieldProps.fKey]: value
        })
        setRefreshable(true)
    }, [updateProfileProperties]);

    return (
        <MeasureFormFieldRefreshable
            fieldProps={fieldProps}
            value={value}
            onValueChange={onValueChange}
            refreshable={refreshable}
        />
    )
}
