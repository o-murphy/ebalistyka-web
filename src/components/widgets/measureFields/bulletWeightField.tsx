import { useCallback } from "react";
import { useProfile } from "../../../context/profileContext";
import MeasureFormField, { MeasureFormFieldProps } from "./measureField"
import { UNew, Unit, UnitProps, Measure } from "js-ballistics/dist/v2"
import debounce from "../../../utils/debounce";
import { usePreferredUnits } from "../../../context/preferredUnitsContext";
import getFractionDigits from "../../../utils/fractionConvertor";


export interface BulletWeightFieldProps extends Omit<MeasureFormFieldProps, 'value' | 'suffix' | 'onValueChange'> { }


export const BulletWeightField: React.FC<BulletWeightFieldProps> = () => {
    const { profileProperties, updateProfileProperties } = useProfile();
    const debouncedProfileUpdate = useCallback(debounce(updateProfileProperties, 300), [updateProfileProperties]);

    const { preferredUnits } = usePreferredUnits()

    const prefUnit = preferredUnits.weight
    const accuracy = getFractionDigits(0.1, UNew.Grain(1).In(prefUnit))

    const fieldProps: Partial<MeasureFormFieldProps> = {
        key: "bWeight",
        label: "Weight",
        icon: "weight",
        fractionDigits: accuracy,
        step: 1 / (10 ** accuracy),
        suffix: UnitProps[prefUnit].symbol,
        minValue: UNew.Grain(1).In(prefUnit),
        maxValue: UNew.Grain(6.5535).In(prefUnit),
    }

    const value: number = UNew.Grain(
        profileProperties?.[fieldProps.key] ? 
        profileProperties[fieldProps.key] / 10 : 
        300
    ).In(prefUnit)
    
    const onValueChange = (value: number): void => {
        return debouncedProfileUpdate({
            [fieldProps.key]: Math.round(new Measure.Weight(value, prefUnit).In(Unit.Grain) * 10)
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
