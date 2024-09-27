import { useCallback } from "react";
import { useProfile } from "../../../context/profileContext";
import MeasureFormField, { MeasureFormFieldProps } from "./measureField"
import { UNew, Unit, UnitProps, preferredUnits, Measure } from "js-ballistics/dist/v2"
import debounce from "../../../utils/debounce";


export interface BulletLengthFieldProps extends Omit<MeasureFormFieldProps, 'value' | 'suffix' | 'onValueChange'> { }


export const BulletLengthField: React.FC<BulletLengthFieldProps> = () => {
    const { profileProperties, updateProfileProperties } = useProfile();
    const debouncedProfileUpdate = useCallback(debounce(updateProfileProperties, 300), [updateProfileProperties]);

    const unitProps = UnitProps[preferredUnits.length]

    const fieldProps: Partial<MeasureFormFieldProps> = {
        key: "bLength",
        label: "Length",
        icon: "arrow-expand-horizontal",
        fractionDigits: unitProps.accuracy,
        step: 1 / (10 ** unitProps.accuracy),
        suffix: unitProps.symbol,
        minValue: UNew.Inch(0).In(preferredUnits.length),
        maxValue: UNew.Inch(100).In(preferredUnits.length),
    }

    const value: number = profileProperties ? UNew.Inch(profileProperties[fieldProps.key] / 1000).In(preferredUnits.length) : 0

    const onValueChange = (value: number): void => {
        return debouncedProfileUpdate({
            [fieldProps.key]: Math.round(new Measure.Distance(value, preferredUnits.length).In(Unit.Inch) * 1000)
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
