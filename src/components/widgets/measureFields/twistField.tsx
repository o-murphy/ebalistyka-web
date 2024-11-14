import { CalculationState, useProfile } from "../../../context/profileContext";
import { MeasureFormFieldProps, MeasureFormFieldRefreshable } from "./measureField"
import { UNew, Unit, UnitProps, Measure } from "js-ballistics/dist/v2"
import { usePreferredUnits } from "../../../context/preferredUnitsContext";
import getFractionDigits from "../../../utils/fractionConvertor";
import { useCallback, useEffect, useMemo, useState } from "react";


export const TwistField = () => {
    const { profileProperties, updateProfileProperties, calcState } = useProfile();

    const { preferredUnits } = usePreferredUnits()

    const [refreshable, setRefreshable] = useState(false)

    useEffect(() => {
        if (calcState === CalculationState.Complete) {
            setRefreshable(false)
        }
    }, [calcState]);

    const prefUnit = useMemo(() => preferredUnits.sizes, [preferredUnits.sizes])
    const accuracy = useMemo(() => getFractionDigits(0.01, UNew.Inch(1).In(prefUnit)), [prefUnit])

    const fieldProps: Partial<MeasureFormFieldProps> = useMemo(() => ({
        fKey: "rTwist",
        label: "Twist",
        icon: "screw-flat-top",
        fractionDigits: accuracy,
        step: 1 / (10 ** accuracy),
        suffix: UnitProps[prefUnit].symbol,
        minValue: UNew.Inch(0).In(prefUnit),
        maxValue: UNew.Inch(100).In(prefUnit),
    }), [accuracy, prefUnit])

    const value: number = useMemo(() => UNew.Inch(
        profileProperties?.rTwist ? 
        profileProperties.rTwist / 100 : 10
    ).In(prefUnit), [profileProperties?.rTwist, prefUnit])

    const onValueChange = useCallback((value: number): void => {
        updateProfileProperties({
            rTwist: new Measure.Distance(value, prefUnit).In(Unit.Inch) * 100
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
