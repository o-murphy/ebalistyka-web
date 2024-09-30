import React, { useEffect, useRef, useState } from "react";
import CustomCard from "./customCard";
import { CalculationState, useProfile } from "../../context/profileContext";
import { ZeroTemperatureField } from "../widgets/measureFields";
import { ZeroPressureField } from "../widgets/measureFields/zeroPressureField";
import { ZeroHumidityField } from "../widgets/measureFields/zeroHumidityField";
import { ProfileProps } from "../../utils/parseA7P";
import RecalculateChip from "../widgets/recalculateChip";

interface AtmoCardProps {
    label?: string;
    expanded?: boolean;
}

const ZeroAtmoCard: React.FC<AtmoCardProps> = ({ label = "Zero atmosphere", expanded = true }) => {

    const { profileProperties, calcState, autoRefresh } = useProfile();

    const [refreshable, setRefreshable] = useState(false)

    const prevProfilePropertiesRef = useRef<ProfileProps | null>(null);

    useEffect(() => {

        if ([CalculationState.ZeroUpdated].includes(calcState) && !autoRefresh) {
            const temperature = prevProfilePropertiesRef.current?.cZeroAirTemperature !== profileProperties.cZeroAirTemperature;
            const pressure = prevProfilePropertiesRef.current?.cZeroAirPressure !== profileProperties.cZeroAirPressure;
            const humidity = prevProfilePropertiesRef.current?.cZeroAirHumidity !== profileProperties.cZeroAirHumidity
    
            if (temperature || pressure || humidity) {
                setRefreshable(true)
            } else {
                setRefreshable(false)
            }
    
        } else {
            setRefreshable(false)
        }

        // Update the ref with the current profileProperties
        prevProfilePropertiesRef.current = profileProperties;
    }, [profileProperties, calcState]);

    if (!profileProperties) {
        return (
            <CustomCard title={"Zero atmosphere"} expanded={expanded}>
                {/* <ActivityIndicator animating={true} /> */}
            </CustomCard>
        )
    }

    return (
        <CustomCard title={label} expanded={expanded}>
            <RecalculateChip visible={refreshable} style={{  }} />

            <ZeroTemperatureField />
            <ZeroPressureField />
            <ZeroHumidityField />

        </CustomCard>
    );
};

export default ZeroAtmoCard;
