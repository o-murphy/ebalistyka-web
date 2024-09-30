import { useCallback } from "react";
import { useProfile } from "../../../context/profileContext";
import MeasureFormField, { MeasureFormFieldProps } from "./measureField"
import { UNew, Unit, UnitProps, Measure } from "js-ballistics/dist/v2"
import debounce from "../../../utils/debounce";
import { usePreferredUnits } from "../../../context/preferredUnitsContext";
import getFractionDigits from "../../../utils/fractionConvertor";


export interface BulletLengthFieldProps extends Omit<MeasureFormFieldProps, 'value' | 'suffix' | 'onValueChange'> { }

export const BulletLengthField: React.FC<BulletLengthFieldProps> = () => {
    const { profileProperties, updateProfileProperties } = useProfile();
    const debouncedProfileUpdate = useCallback(debounce(updateProfileProperties, 300), [updateProfileProperties]);

    const { preferredUnits } = usePreferredUnits()

    const prefUnit = preferredUnits.sizes
    const accuracy = getFractionDigits(0.001, UNew.Inch(1).In(prefUnit))

    const fieldProps: Partial<MeasureFormFieldProps> = {
        key: "bLength",
        label: "Length",
        icon: "arrow-expand-horizontal",
        fractionDigits: accuracy,
        step: 1 / (10 ** accuracy),
        suffix: UnitProps[prefUnit].symbol,
        minValue: UNew.Inch(0).In(prefUnit),
        maxValue: UNew.Inch(100).In(prefUnit),
    }

    const value: number = UNew.Inch(
        profileProperties?.[fieldProps.key] ? 
        profileProperties[fieldProps.key] / 1000 : 
        1.7
    ).In(prefUnit)

    const onValueChange = (value: number): void => {
        return debouncedProfileUpdate({
            [fieldProps.key]: Math.round(new Measure.Distance(value, prefUnit).In(Unit.Inch) * 1000)
        })
    }

    console.log(fieldProps.fractionDigits)
    return (
        <MeasureFormField
            {...fieldProps}
            value={value}
            onValueChange={onValueChange}
        />
    )
}
