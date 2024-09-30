import { useCallback } from "react";
import { useProfile } from "../../../context/profileContext";
import MeasureFormField, { MeasureFormFieldProps } from "./measureField"
import { UNew, Unit, UnitProps, Measure } from "js-ballistics/dist/v2"
import debounce from "../../../utils/debounce";
import { usePreferredUnits } from "../../../context/preferredUnitsContext";
import getFractionDigits from "../../../utils/fractionConvertor";

export interface ZeroLookAngleFieldProps extends Omit<MeasureFormFieldProps, 'value' | 'suffix' | 'onValueChange'> { }


export const ZeroLookAngleField: React.FC<ZeroLookAngleFieldProps> = () => {
    const { profileProperties, updateProfileProperties } = useProfile();
    const debouncedProfileUpdate = useCallback(debounce(updateProfileProperties, 300), [updateProfileProperties]);

    const { preferredUnits } = usePreferredUnits()

    const prefUnit = preferredUnits.angular
    const accuracy = getFractionDigits(0.01, UNew.Degree(1).In(prefUnit))

    const fieldProps: Partial<MeasureFormFieldProps> = {
        key: "cZeroWPitch",
        label: "Look angle",
        icon: "angle-acute",
        fractionDigits: accuracy,
        step: 1 / (10 ** accuracy),
        suffix: UnitProps[prefUnit].symbol,
        minValue: UNew.Degree(-90).In(prefUnit),
        maxValue: UNew.Degree(90).In(prefUnit),
    }

    const value: number = UNew.Degree(
        profileProperties?.[fieldProps.key] ? 
        profileProperties[fieldProps.key] / 10 : 0
    ).In(prefUnit)

    const onValueChange = (value: number): void => {
        return debouncedProfileUpdate({
            [fieldProps.key]: Math.round(new Measure.Angular(value, prefUnit).In(Unit.Degree) * 10)
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
