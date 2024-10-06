import React from "react";
import CustomCard from "./customCard";
import { useCalculator } from "../../context/profileContext";
import { CurrentHumidityField, CurrentPressureField, CurrentTemperatureField } from "../widgets/measureFields";


interface AtmoCardProps {
    label?: string;
    expanded?: boolean;
}

const CurrentAtmoCard: React.FC<AtmoCardProps> = ({ label = "Current atmosphere", expanded = true }) => {

    const { currentConditions } = useCalculator();

    if (!currentConditions) {
        return (
            <CustomCard title={label} expanded={expanded} />
        )
    }

    return (
        <CustomCard title={label} expanded={expanded}>
            <CurrentTemperatureField />
            <CurrentPressureField />
            <CurrentHumidityField />
        </CustomCard>
    );
};

export default CurrentAtmoCard;
