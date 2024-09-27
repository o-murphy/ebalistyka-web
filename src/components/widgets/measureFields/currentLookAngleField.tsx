import { useCallback } from "react";
import { useProfile } from "../../../context/profileContext";
import MeasureFormField, { MeasureFormFieldProps } from "./measureField"
import { UNew, Unit, UnitProps, preferredUnits, Measure } from "js-ballistics/dist/v2"
import debounce from "../../../utils/debounce";


export interface CurrentLookAngleFieldProps extends Omit<MeasureFormFieldProps, 'value' | 'suffix' | 'onValueChange'> { }


export const CurrentLookAngleField: React.FC<CurrentLookAngleFieldProps> = () => {
    const { currentConditions, updateCurrentConditions } = useProfile();
    const debouncedUpdateConditions = useCallback(debounce(updateCurrentConditions, 350), [updateCurrentConditions]);

    const unitProps = UnitProps[preferredUnits.angular]

    const fieldProps: Partial<MeasureFormFieldProps> = {
        key: "lookAngle",
        label: "Look angle",
        icon: "angle-acute",
        fractionDigits: unitProps.accuracy,
        step: 1 / (10 ** unitProps.accuracy),
        suffix: unitProps.symbol,
        minValue: UNew.Degree(-90).In(preferredUnits.angular),
        maxValue: UNew.Degree(90).In(preferredUnits.angular),
    }

    const value: number = currentConditions ? UNew.Degree(currentConditions[fieldProps.key] / 10).In(preferredUnits.angular) : 0

    const onValueChange = (value: number): void => {
        return debouncedUpdateConditions({
            [fieldProps.key]: Math.round(new Measure.Angular(value, preferredUnits.angular).In(Unit.Degree) * 10)
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
