import { useCalculator } from "../../../context/profileContext";
import MeasureFormField, { MeasureFormFieldProps } from "./measureField"
import { UNew, Unit, UnitProps, Measure } from "js-ballistics/dist/v2"
import { usePreferredUnits } from "../../../context/preferredUnitsContext";
import getFractionDigits from "../../../utils/fractionConvertor";


export const ZeroDistanceField = () => {
    const { profileProperties, updateProfileProperties, currentConditions } = useCalculator();

    const { preferredUnits } = usePreferredUnits()

    const prefUnit = preferredUnits.distance
    const accuracy = getFractionDigits(1, UNew.Meter(1).In(prefUnit))

    const step = UNew.Meter(currentConditions.trajectoryStep).In(prefUnit).toFixed(0).length

    const fieldProps: Partial<MeasureFormFieldProps> = {
        // fKey: "trajectoryRange",
        label: "Zero distance",
        icon: "arrow-left-right",
        fractionDigits: accuracy,
        step: 10 ** step,
        suffix: UnitProps[prefUnit].symbol,
        minValue: UNew.Meter(10).In(prefUnit),
        maxValue: UNew.Meter(3000).In(prefUnit),
    }

    const value: number = UNew.Meter(
        profileProperties.distances[profileProperties.cZeroDistanceIdx] / 100
    ).In(prefUnit)

    const onValueChange = (value: number): void => {
        const distances = profileProperties.distances
        const newValue = new Measure.Distance(value * 100, prefUnit).In(Unit.Meter)
        if (!distances.includes(newValue)) {
            distances.push(newValue)
            distances.sort((a, b) => a - b)
        }
        updateProfileProperties({
            distances: distances,
            cZeroDistanceIdx: distances.indexOf(newValue)
        });
    }

    return (
        <MeasureFormField
            {...fieldProps}
            value={value}
            onValueChange={onValueChange}
        />
    )
}
