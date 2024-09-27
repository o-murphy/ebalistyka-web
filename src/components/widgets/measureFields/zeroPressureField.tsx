import { useCallback } from "react";
import { useProfile } from "../../../context/profileContext";
import MeasureFormField, { MeasureFormFieldProps } from "./measureField"
import { UNew, Unit, UnitProps, preferredUnits, Measure } from "js-ballistics/dist/v2"
import debounce from "../../../utils/debounce";


export interface ZeroPressureFieldProps extends Omit<MeasureFormFieldProps, 'value' | 'suffix' | 'onValueChange'> { }


export const ZeroPressureField: React.FC<ZeroPressureFieldProps> = () => {
    const { profileProperties, updateProfileProperties } = useProfile();
    const debouncedProfileUpdate = useCallback(debounce(updateProfileProperties, 300), [updateProfileProperties]);

    const unitProps = UnitProps[preferredUnits.pressure]

    const fieldProps: Partial<MeasureFormFieldProps> = {
        key: "cZeroAirPressure",
        label: "Pressure",
        icon: "speedometer",
        fractionDigits: unitProps.accuracy,
        step: 1 / (10 ** unitProps.accuracy),
        suffix: unitProps.symbol,
        minValue: UNew.hPa(500).In(preferredUnits.pressure),
        maxValue: UNew.hPa(1300).In(preferredUnits.pressure),
    }

    const value: number = profileProperties ? UNew.hPa(profileProperties[fieldProps.key]).In(preferredUnits.pressure) : 0

    const onValueChange = (value: number): void => {
        return debouncedProfileUpdate({
            [fieldProps.key]: Math.round(new Measure.Pressure(value, preferredUnits.pressure).In(Unit.hPa))
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
