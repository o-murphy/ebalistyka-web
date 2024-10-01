import { useProfile } from "../../../context/profileContext";
import MeasureFormField, { MeasureFormFieldProps } from "./measureField"
import { UNew, Unit, UnitProps, Measure } from "js-ballistics/dist/v2"
import { usePreferredUnits } from "../../../context/preferredUnitsContext";
import getFractionDigits from "../../../utils/fractionConvertor";
import { useEffect } from "react";

export interface CurrentLookAngleFieldProps extends Omit<MeasureFormFieldProps, 'value' | 'suffix' | 'onValueChange'> { }


export const CurrentLookAngleField: React.FC<CurrentLookAngleFieldProps> = () => {
    const { currentConditions, updateCurrentConditions } = useProfile();

    const { preferredUnits } = usePreferredUnits()

    const prefUnit = preferredUnits.angular
    const accuracy = getFractionDigits(0.01, UNew.MIL(1).In(prefUnit))

    const fieldProps: Partial<MeasureFormFieldProps> = {
        fKey: "lookAngle",
        label: "Look angle",
        icon: "angle-acute",
        fractionDigits: accuracy,
        step: 1 / (10 ** accuracy),
        suffix: UnitProps[prefUnit].symbol,
        minValue: UNew.Degree(-90).In(prefUnit),
        maxValue: UNew.Degree(90).In(prefUnit),
    }

    const value: number = UNew.Degree(
        currentConditions?.[fieldProps.fKey] ? 
        currentConditions[fieldProps.fKey] : 0
    ).In(prefUnit)

    const onValueChange = (value: number): void => {
        return updateCurrentConditions({
            [fieldProps.fKey]: new Measure.Angular(value, prefUnit).In(Unit.Degree)
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
