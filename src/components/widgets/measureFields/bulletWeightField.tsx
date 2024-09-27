import { useCallback } from "react";
import { useProfile } from "../../../context/profileContext";
import MeasureFormField, { MeasureFormFieldProps } from "./measureField"
import { UNew, Unit, UnitProps, preferredUnits, Measure } from "js-ballistics/dist/v2"
import debounce from "../../../utils/debounce";


export interface BulletWeightFieldProps extends Omit<MeasureFormFieldProps, 'value' | 'suffix' | 'onValueChange'> { }


export const BulletWeightField: React.FC<BulletWeightFieldProps> = () => {
    const { profileProperties, updateProfileProperties } = useProfile();
    const debouncedProfileUpdate = useCallback(debounce(updateProfileProperties, 350), [updateProfileProperties]);

    const unitProps = UnitProps[preferredUnits.weight]

    const fieldProps: Partial<MeasureFormFieldProps> = {
        key: "bWeight",
        label: "Weight",
        icon: "weight",
        fractionDigits: unitProps.accuracy,
        step: 1 / (10 ** unitProps.accuracy),
        suffix: unitProps.symbol,
        minValue: UNew.Grain(1).In(preferredUnits.weight),
        maxValue: UNew.Grain(6.5535).In(preferredUnits.weight),
    }

    const value: number = profileProperties ? UNew.Grain(profileProperties[fieldProps.key] / 10).In(preferredUnits.weight) : 0

    const onValueChange = (value: number): void => {
        return debouncedProfileUpdate({
            [fieldProps.key]: Math.round(new Measure.Weight(value, preferredUnits.weight).In(Unit.Grain) * 10)
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
