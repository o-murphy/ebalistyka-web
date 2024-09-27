import { useCallback } from "react";
import { useProfile } from "../../../context/profileContext";
import MeasureFormField, { MeasureFormFieldProps } from "./measureField"
import { UNew, Unit, UnitProps, preferredUnits, Measure } from "js-ballistics/dist/v2"
import debounce from "../../../utils/debounce";


export interface CurrentPressureFieldProps extends Omit<MeasureFormFieldProps, 'value' | 'suffix' | 'onValueChange'> { }


export const CurrentPressureField: React.FC<CurrentPressureFieldProps> = () => {
    const { currentConditions, updateCurrentConditions } = useProfile();
    const debouncedUpdateConditions = useCallback(debounce(updateCurrentConditions, 350), [updateCurrentConditions]);

    const unitProps = UnitProps[preferredUnits.pressure]

    const fieldProps: Partial<MeasureFormFieldProps> = {
        key: "pressure",
        label: "Pressure",
        icon: "speedometer",
        fractionDigits: unitProps.accuracy,
        step: 1 / (10 ** unitProps.accuracy),
        suffix: unitProps.symbol,
        minValue: UNew.hPa(500).In(preferredUnits.pressure),
        maxValue: UNew.hPa(1300).In(preferredUnits.pressure),
    }

    const value: number = currentConditions ? UNew.hPa(currentConditions[fieldProps.key]).In(preferredUnits.pressure) : 0

    const onValueChange = (value: number): void => {
        return debouncedUpdateConditions({
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
