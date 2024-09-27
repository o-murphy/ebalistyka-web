import React, { useCallback, useEffect, useState } from "react";
import CustomCard from "./customCard";
import WindDirectionPicker from "../widgets/windDirectionPicker";
import { MeasureFormFieldProps } from "../widgets/measureFields/measureField/measureField";
import { useProfile } from "../../context/profileContext";
import debounce from "../../utils/debounce";
import { preferredUnits, UNew, UnitProps, Unit, Measure } from "js-ballistics/dist/v2";
import MeasureFormField from "../widgets/measureFields/measureField";


interface WindCardProps {
    label?: string;
    expanded?: boolean;
}

const CurrentWindCard: React.FC<WindCardProps> = ({ label = "Zero wind direction and speed", expanded = true }) => {
    const { currentConditions, updateCurrentConditions } = useProfile();
    const debouncedUpdateConditions = useCallback(debounce(updateCurrentConditions, 350), [updateCurrentConditions]);

    const [windDir, setWindDir] = useState(currentConditions.windDirection)
    const [windSpeed, setWindSpeed] = useState(currentConditions.windSpeed)

    // const windSpeedValue = UNew.MPS(windSpeed).In(preferredUnits.velocity)

    // const setWindSpeedValue = (value) => {
    //     setWindSpeed(new Measure.Velocity(value, currentConditions.windSpeed).In(Unit.Meter))
    // }

    const unitProps = UnitProps[preferredUnits.velocity]

    const fieldProps: Partial<MeasureFormFieldProps> = {
        key: "windSpeed",
        label: "Wind speed",
        icon: "windsock",
        fractionDigits: unitProps.accuracy,
        step: 1 / (10 ** unitProps.accuracy),
        suffix: unitProps.symbol,
        minValue: UNew.MPS(0).In(preferredUnits.velocity),
        maxValue: UNew.MPS(100).In(preferredUnits.velocity),
    }

    const windValue: number = currentConditions ? UNew.MPS(windSpeed).In(preferredUnits.velocity) : 0
    const onWindValueChange = (value: number): void => {
        return setWindSpeed(
            Math.round(new Measure.Velocity(value, preferredUnits.velocity).In(Unit.MPS))
        )
    }


    useEffect(() => {
        if (windSpeed != 0) {
            console.log("Wind SET")
            debouncedUpdateConditions({ windDirection: windDir, windSpeed: windSpeed })
        }
    }, [windDir, windSpeed])

    return (
        <CustomCard title={label} expanded={expanded}>
            <WindDirectionPicker
                style={{ alignItems: 'center' }}
                value={windDir}
                onChange={setWindDir}
            />

            <MeasureFormField
                {...fieldProps}
                value={windValue}
                onValueChange={onWindValueChange}
            />
        </CustomCard>
    );
};

export default CurrentWindCard;
