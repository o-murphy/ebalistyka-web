import { useCallback } from "react";
import { useProfile } from "../../../context/profileContext";
import MeasureFormField, { MeasureFormFieldProps } from "./measureField"
import { UNew, Unit, UnitProps, Measure } from "js-ballistics/dist/v2"
import debounce from "../../../utils/debounce";
import { usePreferredUnits } from "../../../context/preferredUnitsContext";
import getFractionDigits from "../../../utils/fractionConvertor";

export interface CurrentPressureFieldProps extends Omit<MeasureFormFieldProps, 'value' | 'suffix' | 'onValueChange'> { }


export const CurrentPressureField: React.FC<CurrentPressureFieldProps> = () => {
    const { currentConditions, updateCurrentConditions } = useProfile();
    const debouncedUpdateConditions = useCallback(debounce(updateCurrentConditions, 350), [updateCurrentConditions]);

    const { preferredUnits } = usePreferredUnits()

    const prefUnit = preferredUnits.pressure
    const accuracy = getFractionDigits(1, UNew.hPa(1).In(prefUnit))

    const fieldProps: Partial<MeasureFormFieldProps> = {
        key: "pressure",
        label: "Pressure",
        icon: "speedometer",
        fractionDigits: accuracy,
        step: 1 / (10 ** accuracy),
        suffix: UnitProps[prefUnit].symbol,
        minValue: UNew.hPa(500).In(prefUnit),
        maxValue:UNew.hPa(1300).In(prefUnit),
    }

    const value: number = currentConditions ? UNew.hPa(currentConditions[fieldProps.key]).In(prefUnit) : 0

    const onValueChange = (value: number): void => {
        return debouncedUpdateConditions({
            [fieldProps.key]: new Measure.Pressure(value, prefUnit).In(Unit.hPa)
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
