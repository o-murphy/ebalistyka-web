import { useProfile } from "../../../context/profileContext";
import MeasureFormField, { MeasureFormFieldProps } from "./measureField"
import { UNew, Unit, UnitProps, Measure } from "js-ballistics/dist/v2"
import { usePreferredUnits } from "../../../context/preferredUnitsContext";
import getFractionDigits from "../../../utils/fractionConvertor";


export const CurrentPressureField = () => {
    const { currentConditions, updateCurrentConditions } = useProfile();

    const { preferredUnits } = usePreferredUnits()

    const prefUnit = preferredUnits.pressure
    const accuracy = getFractionDigits(1, UNew.hPa(1).In(prefUnit))

    const fieldProps: Partial<MeasureFormFieldProps> = {
        fKey: "pressure",
        label: "Pressure",
        icon: "speedometer",
        fractionDigits: accuracy,
        step: 1 / (10 ** accuracy),
        suffix: UnitProps[prefUnit].symbol,
        minValue: UNew.hPa(500).In(prefUnit),
        maxValue:UNew.hPa(1300).In(prefUnit),
    }

    const value: number = UNew.hPa(
        currentConditions?.[fieldProps.fKey] ? 
        currentConditions[fieldProps.fKey] : 1000
    ).In(prefUnit)

    const onValueChange = (value: number): void => {
        return updateCurrentConditions({
            [fieldProps.fKey]: new Measure.Pressure(value, prefUnit).In(Unit.hPa)
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
