import { useProfile } from "../../../context/profileContext";
import MeasureFormField, { MeasureFormFieldProps } from "./measureField"
import { UNew, Unit, UnitProps, Measure } from "js-ballistics/dist/v2"
import { usePreferredUnits } from "../../../context/preferredUnitsContext";
import getFractionDigits from "../../../utils/fractionConvertor";


export const BulletLengthField = () => {
    const { profileProperties, updateProfileProperties } = useProfile();

    const { preferredUnits } = usePreferredUnits()

    const prefUnit = preferredUnits.sizes
    const accuracy = getFractionDigits(0.001, UNew.Inch(1).In(prefUnit))

    const fieldProps: Partial<MeasureFormFieldProps> = {
        fKey: "bLength",
        label: "Length",
        icon: "arrow-expand-horizontal",
        fractionDigits: accuracy,
        step: 1 / (10 ** accuracy),
        suffix: UnitProps[prefUnit].symbol,
        minValue: UNew.Inch(0).In(prefUnit),
        maxValue: UNew.Inch(100).In(prefUnit),
    }

    const value: number = UNew.Inch(
        profileProperties?.[fieldProps.fKey] ? 
        profileProperties[fieldProps.fKey] / 1000 : 
        1.7
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
