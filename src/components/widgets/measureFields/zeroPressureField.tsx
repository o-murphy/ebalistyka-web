import { useCallback } from "react";
import { useProfile } from "../../../context/profileContext";
import MeasureFormField, { MeasureFormFieldProps } from "./measureField"
import { UNew, Unit, UnitProps, Measure } from "js-ballistics/dist/v2"
import debounce from "../../../utils/debounce";
import { usePreferredUnits } from "../../../context/preferredUnitsContext";
import getFractionDigits from "../../../utils/fractionConvertor";

export interface ZeroPressureFieldProps extends Omit<MeasureFormFieldProps, 'value' | 'suffix' | 'onValueChange'> { }


export const ZeroPressureField: React.FC<ZeroPressureFieldProps> = () => {
    const { profileProperties, updateProfileProperties } = useProfile();
    const debouncedProfileUpdate = useCallback(debounce(updateProfileProperties, 300), [updateProfileProperties]);

    const { preferredUnits } = usePreferredUnits()

    const prefUnit = preferredUnits.pressure
    const accuracy = getFractionDigits(1, UNew.hPa(1).In(prefUnit))

    const fieldProps: Partial<MeasureFormFieldProps> = {
        key: "cZeroAirPressure",
        label: "Pressure",
        icon: "speedometer",
        fractionDigits: accuracy,
        step: 1 / (10 ** accuracy),
        suffix: UnitProps[prefUnit].symbol,
        minValue: UNew.hPa(500).In(prefUnit),
        maxValue:UNew.hPa(1300).In(prefUnit),
    }

    const value: number = profileProperties ? UNew.hPa(profileProperties[fieldProps.key] / 10).In(prefUnit) : 0

    const onValueChange = (value: number): void => {
        return debouncedProfileUpdate({
            [fieldProps.key]: Math.round(new Measure.Pressure(value, prefUnit).In(Unit.hPa) * 10)
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
