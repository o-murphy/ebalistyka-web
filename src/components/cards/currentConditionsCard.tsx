import React, { useEffect, useRef, useState } from "react";
import CustomCard from "./customCard";
import { CalculationState, useProfile } from "../../context/profileContext";
import { CurrentHumidityField, CurrentLookAngleField, CurrentPressureField, CurrentTemperatureField } from "../widgets/measureFields";
import { CurrentConditionsProps } from "../../utils/ballisticsCalculator";
import RecalculateChip from "../widgets/recalculateChip";

interface AtmoCardProps {
    label?: string;
    expanded?: boolean;
}

const CurrentConditionsCard: React.FC<AtmoCardProps> = ({ label = "Zero atmosphere", expanded = true }) => {

    const { currentConditions, calcState } = useProfile();

    const [refreshable, setRefreshable] = useState(false)

    const prevCurrentConditionsRef = useRef<CurrentConditionsProps | null>(null);

    useEffect(() => {

        if ([CalculationState.ConditionsUpdated].includes(calcState)) {
            const temperature = prevCurrentConditionsRef.current?.temperature !== currentConditions.temperature;
            const pressure = prevCurrentConditionsRef.current?.pressure !== currentConditions.pressure;
            const humidity = prevCurrentConditionsRef.current?.humidity !== currentConditions.humidity
            const lookAngle = prevCurrentConditionsRef.current?.lookAngle !== currentConditions.lookAngle
    
            if (temperature || pressure || humidity || lookAngle) {
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

    if (!currentConditions) {
        return (
            <CustomCard title={label} expanded={expanded} />
        )
    }

    return (
        <CustomCard title={label} expanded={expanded}>
            <RecalculateChip visible={refreshable} style={{  }} />

            <CurrentTemperatureField />
            <CurrentPressureField />
            <CurrentHumidityField />
            <CurrentLookAngleField />
        </CustomCard>
    );
};

export default CurrentConditionsCard;
