import { useCallback } from "react";
import { useProfile } from "../../../context/profileContext";
import MeasureFormField, { MeasureFormFieldProps } from "./measureField"
import { UNew, Unit, UnitProps, preferredUnits, Measure } from "js-ballistics/dist/v2"
import debounce from "../../../utils/debounce";


export interface SightHeightFieldProps extends Omit<MeasureFormFieldProps, 'value' | 'suffix' | 'onValueChange'> { }


export const SightHeightField: React.FC<SightHeightFieldProps> = () => {
    const { profileProperties, updateProfileProperties } = useProfile();
    const debouncedProfileUpdate = useCallback(debounce(updateProfileProperties, 300), [updateProfileProperties]);

    const unitProps = UnitProps[preferredUnits.sight_height]

    const fieldProps: Partial<MeasureFormFieldProps> = {
        key: "scHeight",
        label: "Sight height",
        icon: "crosshairs",
        fractionDigits: unitProps.accuracy,
        step: 1 / (10 ** unitProps.accuracy),
        suffix: unitProps.symbol,
        minValue: UNew.Inch(-5).In(preferredUnits.sight_height),
        maxValue: UNew.Inch(5).In(preferredUnits.sight_height),
    }

    const value: number = profileProperties ? UNew.Millimeter(profileProperties[fieldProps.key]).In(preferredUnits.sight_height) : 0

    const onValueChange = (value: number): void => {
        return debouncedProfileUpdate({
            [fieldProps.key]: Math.round(new Measure.Distance(value, preferredUnits.sight_height).In(Unit.Millimeter))
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
