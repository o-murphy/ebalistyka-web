import { useCallback } from "react";
import { useProfile } from "../../../context/profileContext";
import MeasureFormField, { MeasureFormFieldProps } from "./measureField"
import { UNew, Unit, UnitProps, preferredUnits, Measure } from "js-ballistics/dist/v2"
import debounce from "../../../utils/debounce";


export interface MuzzleVelocityFieldProps extends Omit<MeasureFormFieldProps, 'value' | 'suffix' | 'onValueChange'> { }


export const MuzzleVelocityField: React.FC<MuzzleVelocityFieldProps> = () => {
    const { profileProperties, updateProfileProperties } = useProfile();
    const debouncedProfileUpdate = useCallback(debounce(updateProfileProperties, 300), [updateProfileProperties]);

    const unitProps = UnitProps[preferredUnits.velocity]

    const fieldProps: Partial<MeasureFormFieldProps> = {
        key: "cMuzzleVelocity",
        label: "Muzzle velocity",
        icon: "speedometer",
        fractionDigits: unitProps.accuracy,
        step: 1 / (10 ** unitProps.accuracy),
        suffix: unitProps.symbol,
        minValue: UNew.MPS(1.0).In(preferredUnits.velocity),
        maxValue: UNew.MPS(3000.0).In(preferredUnits.velocity),
    }

    const value: number = profileProperties ? UNew.MPS(profileProperties[fieldProps.key] / 10).In(preferredUnits.velocity) : 0

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
