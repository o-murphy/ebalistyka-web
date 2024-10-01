import { useProfile } from "../../../context/profileContext";
import MeasureFormField, { MeasureFormFieldProps } from "./measureField"
import { UNew, Unit, UnitProps, Measure } from "js-ballistics/dist/v2"
import { usePreferredUnits } from "../../../context/preferredUnitsContext";
import getFractionDigits from "../../../utils/fractionConvertor";


export const ZeroTemperatureField = () => {
    const { profileProperties, updateProfileProperties } = useProfile();

    const { preferredUnits } = usePreferredUnits()

    const prefUnit = preferredUnits.temperature
    const accuracy = getFractionDigits(1, UNew.Celsius(1).In(prefUnit))

    const fieldProps: Partial<MeasureFormFieldProps> = {
        fKey: "cZeroAirTemperature",
        label: "Temperature",
        icon: "thermometer",
        fractionDigits: accuracy,
        step: 1 / (10 ** accuracy),
        suffix: UnitProps[prefUnit].symbol,
        minValue: UNew.Celsius(-50).In(prefUnit),
        maxValue: UNew.Celsius(50).In(prefUnit),
    }

    const value: number = UNew.Celsius(
        profileProperties?.[fieldProps.fKey] ?
            profileProperties[fieldProps.fKey] : 15
    ).In(prefUnit)

    const onValueChange = (value: number): void => {
        return updateProfileProperties({
            [fieldProps.fKey]: new Measure.Temperature(value, prefUnit).In(Unit.Celsius)
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
