import { useCallback } from "react";
import { useProfile } from "../../../context/profileContext";
import MeasureFormField, { MeasureFormFieldProps } from "./measureField"
import { UNew, Unit, UnitProps, preferredUnits, Measure } from "js-ballistics/dist/v2"
import debounce from "../../../utils/debounce";


export interface CaliberFieldProps extends Omit<MeasureFormFieldProps, 'value' | 'suffix' | 'onValueChange'> { }


export const CaliberField: React.FC<CaliberFieldProps> = () => {
    const { profileProperties, updateProfileProperties } = useProfile();
    const debouncedProfileUpdate = useCallback(debounce(updateProfileProperties, 350), [updateProfileProperties]);

    const unitProps = UnitProps[preferredUnits.diameter]

    const fieldProps: Partial<MeasureFormFieldProps> = {
        key: "bDiameter",
        label: "Caliber",
        icon: "diameter-variant",
        fractionDigits: unitProps.accuracy,
        step: 1 / (10 ** unitProps.accuracy),
        suffix: unitProps.symbol,
        minValue: UNew.Inch(0.001).In(preferredUnits.diameter),
        maxValue: UNew.Inch(65.535).In(preferredUnits.diameter),
    }

    const value: number = profileProperties ? UNew.Inch(profileProperties[fieldProps.key] / 1000).In(preferredUnits.diameter) : 0

    const onValueChange = (value: number): void => {
        return debouncedProfileUpdate({
            [fieldProps.key]: Math.round(new Measure.Distance(value, preferredUnits.diameter).In(Unit.Inch) * 1000)
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
