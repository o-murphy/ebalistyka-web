import { useCallback } from "react";
import { useProfile } from "../../../context/profileContext";
import MeasureFormField, { MeasureFormFieldProps } from "./measureField"
import { UNew, Unit, UnitProps, Measure } from "js-ballistics/dist/v2"
import debounce from "../../../utils/debounce";
import { usePreferredUnits } from "../../../context/preferredUnitsContext";
import getFractionDigits from "../../../utils/fractionConvertor";

export interface TrajectoryRangeFieldProps extends Omit<MeasureFormFieldProps, 'value' | 'suffix' | 'onValueChange'> { }


export const TrajectoryRangeField: React.FC<TrajectoryRangeFieldProps> = () => {
    const { currentConditions, updateCurrentConditions } = useProfile();
    const debouncedUpdateConditions = useCallback(debounce(updateCurrentConditions, 350), [updateCurrentConditions]);

    const { preferredUnits } = usePreferredUnits()

    const prefUnit = preferredUnits.distance
    const accuracy = getFractionDigits(1, UNew.Meter(1).In(prefUnit))

    const fieldProps: Partial<MeasureFormFieldProps> = {
        key: "trajectoryRange",
        label: "Trajectory range",
        icon: "",
        fractionDigits: accuracy,
        step: 1 / (10 ** accuracy),
        suffix: UnitProps[prefUnit].symbol,
        minValue: UNew.Meter(10).In(prefUnit),
        maxValue: UNew.Meter(3000).In(prefUnit),
    }

    console.log("Range", currentConditions)


    const value: number = UNew.Meter(
        currentConditions?.[fieldProps.key] ? 
        currentConditions[fieldProps.key] : 2000
    ).In(prefUnit)
    
    const onValueChange = (value: number): void => {
        console.log("On Range", value)
        return debouncedUpdateConditions({
            [fieldProps.key]: new Measure.Distance(value, prefUnit).In(Unit.Meter)
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
