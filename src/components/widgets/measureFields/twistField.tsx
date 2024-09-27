import { useCallback } from "react";
import { useProfile } from "../../../context/profileContext";
import MeasureFormField, { MeasureFormFieldProps } from "./measureField"
import { UNew, Unit, UnitProps, preferredUnits, Measure } from "js-ballistics/dist/v2"
import debounce from "../../../utils/debounce";


export interface TwistFieldProps extends Omit<MeasureFormFieldProps, 'value' | 'suffix' | 'onValueChange'> { }


export const TwistField: React.FC<TwistFieldProps> = () => {
    const { profileProperties, updateProfileProperties } = useProfile();
    const debouncedProfileUpdate = useCallback(debounce(updateProfileProperties, 350), [updateProfileProperties]);

    const unitProps = UnitProps[preferredUnits.twist]

    const fieldProps: Partial<MeasureFormFieldProps> = {
        key: "rTwist",
        label: "Twist",
        icon: "screw-flat-top",
        fractionDigits: unitProps.accuracy,
        step: 0.5, // step: 1 / (10 ** unitProps.accuracy),
        suffix: unitProps.symbol,
        minValue: UNew.Inch(0).In(preferredUnits.twist),
        maxValue: UNew.Inch(100).In(preferredUnits.twist),
    }

    const value: number = profileProperties ? UNew.Inch(profileProperties[fieldProps.key] / 100).In(preferredUnits.twist) : 0

    const onValueChange = (value: number): void => {
        return debouncedProfileUpdate({
            [fieldProps.key]: Math.round(new Measure.Distance(value, preferredUnits.twist).In(Unit.Inch) * 100)
        })
    }

    return (
        <MeasureFormField
            {...fieldProps}
            suffix={UnitProps[preferredUnits.twist].symbol}
            value={value}
            onValueChange={onValueChange}
        />
    )
}
