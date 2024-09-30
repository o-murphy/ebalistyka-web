import React, { useCallback, useEffect, useRef, useState } from "react";
import CustomCard from "./customCard";
import WindDirectionPicker from "../widgets/windDirectionPicker";
import { MeasureFormFieldProps } from "../widgets/measureFields/measureField/measureField";
import { CalculationState, useProfile } from "../../context/profileContext";
import debounce from "../../utils/debounce";
import { preferredUnits, UNew, UnitProps, Unit, Measure } from "js-ballistics/dist/v2";
import MeasureFormField from "../widgets/measureFields/measureField";
import RecalculateChip from "../widgets/recalculateChip";
import { CurrentConditionsProps } from "../../utils/ballisticsCalculator";


interface WindCardProps {
    label?: string;
    expanded?: boolean;
}

const CurrentWindCard: React.FC<WindCardProps> = ({ label = "Zero wind direction and speed", expanded = true }) => {
    const { currentConditions, updateCurrentConditions, calcState, autoRefresh } = useProfile();
    const debouncedUpdateConditions = useCallback(debounce(updateCurrentConditions, 350), [updateCurrentConditions]);

    const [windDir, setWindDir] = useState(currentConditions.windDirection)
    const [windSpeed, setWindSpeed] = useState(currentConditions.windSpeed)

    const [refreshable, setRefreshable] = useState(false)

    const prevCurrentConditionsRef = useRef<CurrentConditionsProps | null>(null);

    useEffect(() => {

        if ([CalculationState.ConditionsUpdated].includes(calcState) && !autoRefresh) {
            const windDirection = prevCurrentConditionsRef.current?.windDirection !== currentConditions.windDirection;
            const stepSpeed = prevCurrentConditionsRef.current?.windSpeed !== currentConditions.windSpeed;
    
            if (windDirection || stepSpeed) {
                setRefreshable(true)
            } else {
                setRefreshable(false)
            }
    
        } else {
            setRefreshable(false)
        }

        // Update the ref with the current profileProperties
        prevCurrentConditionsRef.current = currentConditions;
    }, [currentConditions, calcState]);

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
            new Measure.Velocity(value, preferredUnits.velocity).In(Unit.MPS)
        )
    }


    useEffect(() => {
        if (windSpeed != 0) {
            debouncedUpdateConditions({ windDirection: windDir, windSpeed: windSpeed })
        }
    }, [windDir, windSpeed])

    return (
        <CustomCard title={label} expanded={expanded}>
            <RecalculateChip visible={refreshable} style={{  }} />
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
