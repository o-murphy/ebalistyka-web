import { CalculationState, useProfile } from "../../../context/profileContext";
import { MeasureFormFieldProps, MeasureFormFieldRefreshable } from "./measureField"
import { UNew, Unit, UnitProps, Measure } from "js-ballistics/dist/v2"
import { usePreferredUnits } from "../../../context/preferredUnitsContext";
import getFractionDigits from "../../../utils/fractionConvertor";
import { useCallback, useEffect, useMemo, useState } from "react";


export const ZeroLookAngleField = () => {
    const { calcState, profileProperties, updateProfileProperties } = useProfile();
    const { preferredUnits } = usePreferredUnits()

    const [refreshable, setRefreshable] = useState(false)

    useEffect(() => {
        if (calcState === CalculationState.Complete) {
            setRefreshable(false)
        }
    }, [calcState]);

    const prefUnit = useMemo(() => preferredUnits.angular, [preferredUnits.angular])
    const accuracy = useMemo(() => getFractionDigits(0.1, UNew.Degree(1).In(prefUnit)), [prefUnit])

    const fieldProps: Partial<MeasureFormFieldProps> = useMemo(() => ({
        fKey: "cZeroWPitch",
        label: "Look angle",
        icon: "angle-acute",
        fractionDigits: accuracy,
        step: 1 / (10 ** accuracy),
        suffix: UnitProps[prefUnit].symbol,
        minValue: UNew.Degree(-90).In(prefUnit),
        maxValue: UNew.Degree(90).In(prefUnit),
    }), [accuracy, prefUnit])

    const value: number = useMemo(() => UNew.Degree(
        profileProperties?.cZeroWPitch ?
            profileProperties.cZeroWPitch / 10 : 0
    ).In(prefUnit), [profileProperties?.cZeroWPitch, prefUnit])

    const onValueChange = useCallback((value: number): void => {
        updateProfileProperties({
            cZeroWPitch: new Measure.Angular(value, prefUnit).In(Unit.Degree) * 10
        })
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
