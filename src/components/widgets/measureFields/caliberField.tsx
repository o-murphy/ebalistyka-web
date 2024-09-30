import { useCallback } from "react";
import { useProfile } from "../../../context/profileContext";
import MeasureFormField, { MeasureFormFieldProps } from "./measureField"
import { UNew, Unit, UnitProps, Measure } from "js-ballistics/dist/v2"
import debounce from "../../../utils/debounce";
import { usePreferredUnits } from "../../../context/preferredUnitsContext";
import getFractionDigits from "../../../utils/fractionConvertor";

export interface CaliberFieldProps extends Omit<MeasureFormFieldProps, 'value' | 'suffix' | 'onValueChange'> { }


export const CaliberField: React.FC<CaliberFieldProps> = () => {
    const { profileProperties, updateProfileProperties } = useProfile();
    const debouncedProfileUpdate = useCallback(debounce(updateProfileProperties, 300), [updateProfileProperties]);

    const { preferredUnits } = usePreferredUnits()

    const prefUnit = preferredUnits.sizes
    const accuracy = getFractionDigits(0.001, UNew.Inch(1).In(prefUnit))

    const fieldProps: Partial<MeasureFormFieldProps> = {
        key: "bDiameter",
        label: "Caliber",
        icon: "diameter-variant",
        fractionDigits: accuracy,
        step: 1 / (10 ** accuracy),
        suffix: UnitProps[prefUnit].symbol,
        minValue: UNew.Inch(0.001).In(prefUnit),
        maxValue: UNew.Inch(65.535).In(prefUnit),
    }

    const value: number = profileProperties ? UNew.Inch(profileProperties[fieldProps.key] / 1000).In(prefUnit) : 0

    const onValueChange = (value: number): void => {
        return debouncedProfileUpdate({
            [fieldProps.key]: Math.round(new Measure.Distance(value, prefUnit).In(Unit.Inch) * 1000)
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
