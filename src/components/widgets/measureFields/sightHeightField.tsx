import { CalculationState, useProfile } from "../../../context/profileContext";
import { MeasureFormFieldProps, MeasureFormFieldRefreshable } from "./measureField"
import { UNew, Unit, UnitProps, Measure } from "js-ballistics/dist/v2"
import { usePreferredUnits } from "../../../context/preferredUnitsContext";
import getFractionDigits from "../../../utils/fractionConvertor";
import { useCallback, useEffect, useMemo, useState } from "react";


export const SightHeightField = () => {
    const { calcState, profileProperties, updateProfileProperties } = useProfile();
    const { preferredUnits } = usePreferredUnits()

    const [refreshable, setRefreshable] = useState(false)

    useEffect(() => {
        if (calcState === CalculationState.Complete) {
            setRefreshable(false)
        }
    }, [calcState]);

    const prefUnit = useMemo(() => preferredUnits.sizes, [preferredUnits.sizes])
    const accuracy = useMemo(() => getFractionDigits(0.1, UNew.Inch(1).In(prefUnit)), [prefUnit])

    const fieldProps: Partial<MeasureFormFieldProps> = useMemo(() => ({
        fKey: "scHeight",
        label: "Sight height",
        icon: "crosshairs",
        fractionDigits: accuracy,
        step: 1 / (10 ** accuracy),
        suffix: UnitProps[prefUnit].symbol,
        minValue: UNew.Inch(-5).In(prefUnit),
        maxValue: UNew.Inch(5).In(prefUnit),
    }), [accuracy, prefUnit])

    const value: number = useMemo(() => UNew.Millimeter(
        profileProperties?.scHeight ?
            profileProperties.scHeight : 0
    ).In(prefUnit), [profileProperties?.scHeight, prefUnit])

    const onValueChange = useCallback((value: number): void => {
        updateProfileProperties({
            scHeight: new Measure.Distance(value, prefUnit).In(Unit.Millimeter)
        });
        setRefreshable(true);
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
