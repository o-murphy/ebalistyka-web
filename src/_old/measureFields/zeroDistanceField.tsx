import { CalculationState, useProfile } from "../../../context/profileContext";
import { MeasureFormFieldProps, MeasureFormFieldRefreshable } from "./measureField"
import { UNew, Unit, UnitProps, Distance } from "js-ballistics/dist/v2"
import { usePreferredUnits } from "../../../context/preferredUnitsContext";
import getFractionDigits from "../../../utils/fractionConvertor";
import { useCallback, useEffect, useMemo, useState } from "react";


export const ZeroDistanceField = () => {
    const { calcState, profileProperties, updateProfileProperties, currentConditions } = useProfile();
    const { preferredUnits } = usePreferredUnits()

    const [refreshable, setRefreshable] = useState(false)
    useEffect(() => {
        if ([CalculationState.Complete].includes(calcState)) {
            setRefreshable(false)
        }
    }, [calcState]);

    const prefUnit = useMemo(() => preferredUnits.distance, [preferredUnits.distance])
    const accuracy = useMemo(() => getFractionDigits(1, UNew.Meter(1).In(prefUnit)), [prefUnit])

    const fieldProps: Partial<MeasureFormFieldProps> = useMemo(() => ({
        label: "Zero distance",
        icon: "arrow-left-right",
        fractionDigits: accuracy,
        step: new Distance(50, prefUnit).In(prefUnit),
        suffix: UnitProps[prefUnit].symbol,
        minValue: UNew.Meter(10).In(prefUnit),
        maxValue: UNew.Meter(3000).In(prefUnit),
    }), [accuracy, prefUnit])

    const value: number = useMemo(() => UNew.Meter(
        profileProperties?.distances[profileProperties.cZeroDistanceIdx] / 100
    ).In(prefUnit), [profileProperties?.distances, profileProperties?.cZeroDistanceIdx, prefUnit])

    const onValueChange = useCallback((value: number): void => {
        const distances = profileProperties.distances
        const newValue = new Distance(value * 100, prefUnit).In(Unit.Meter)
        if (!distances.includes(newValue)) {
            distances.push(newValue)
            distances.sort((a, b) => a - b)
        }
        updateProfileProperties({
            distances: distances,
            cZeroDistanceIdx: distances.indexOf(newValue)
        });
        setRefreshable(true)
    }, [updateProfileProperties, prefUnit]);

    return (
        <MeasureFormFieldRefreshable 
            fieldProps={fieldProps}
            value={value}
            onValueChange={onValueChange}
            refreshable={refreshable}
        />
    )
}
