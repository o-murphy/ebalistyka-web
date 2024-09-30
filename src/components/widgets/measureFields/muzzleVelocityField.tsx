import { useCallback } from "react";
import { useProfile } from "../../../context/profileContext";
import MeasureFormField, { MeasureFormFieldProps } from "./measureField"
import { UNew, Unit, UnitProps, Measure } from "js-ballistics/dist/v2"
import debounce from "../../../utils/debounce";
import { usePreferredUnits } from "../../../context/preferredUnitsContext";
import getFractionDigits from "../../../utils/fractionConvertor";


export interface MuzzleVelocityFieldProps extends Omit<MeasureFormFieldProps, 'value' | 'suffix' | 'onValueChange'> { }


export const MuzzleVelocityField: React.FC<MuzzleVelocityFieldProps> = () => {
    const { profileProperties, updateProfileProperties } = useProfile();
    const debouncedProfileUpdate = useCallback(debounce(updateProfileProperties, 300), [updateProfileProperties]);

    const { preferredUnits } = usePreferredUnits()

    const prefUnit = preferredUnits.velocity
    const accuracy = getFractionDigits(1, UNew.MPS(1).In(prefUnit))

    const fieldProps: Partial<MeasureFormFieldProps> = {
        key: "cMuzzleVelocity",
        label: "Muzzle velocity",
        icon: "speedometer",
        fractionDigits: accuracy,
        step: 1 / (10 ** accuracy),
        suffix: UnitProps[prefUnit].symbol,
        minValue: UNew.MPS(1.0).In(prefUnit),
        maxValue: UNew.MPS(3000.0).In(prefUnit),
    }

    const value: number = profileProperties ? UNew.MPS(profileProperties[fieldProps.key] / 10).In(prefUnit) : 0

    const onValueChange = (value: number): void => {
        return debouncedProfileUpdate({
            [fieldProps.key]: Math.round(new Measure.Velocity(value, preferredUnits.velocity).In(Unit.MPS) * 10)
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
