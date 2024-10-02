import { useCalculator } from "../../../context/profileContext";
import MeasureFormField, { MeasureFormFieldProps } from "./measureField"
import { UNew, Unit, UnitProps, Measure } from "js-ballistics/dist/v2"
import { usePreferredUnits } from "../../../context/preferredUnitsContext";
import getFractionDigits from "../../../utils/fractionConvertor";


export const CaliberField = () => {
    const { profileProperties, updateProfileProperties } = useCalculator();

    const { preferredUnits } = usePreferredUnits()

    const prefUnit = preferredUnits.sizes
    const accuracy = getFractionDigits(0.001, UNew.Inch(1).In(prefUnit))

    const fieldProps: Partial<MeasureFormFieldProps> = {
        fKey: "bDiameter",
        label: "Caliber",
        icon: "diameter-variant",
        fractionDigits: accuracy,
        step: 1 / (10 ** accuracy),
        suffix: UnitProps[prefUnit].symbol,
        minValue: UNew.Inch(0.001).In(prefUnit),
        maxValue: UNew.Inch(65.535).In(prefUnit),
    }

    const value: number = UNew.Inch(
        profileProperties?.[fieldProps.fKey] ? 
        profileProperties[fieldProps.fKey] / 1000 : 
        0.338
    ).In(prefUnit)

    const onValueChange = (value: number): void => {
        return updateProfileProperties({
            [fieldProps.fKey]: new Measure.Distance(value, prefUnit).In(Unit.Inch) * 1000
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
