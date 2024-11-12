import React from "react";
import CustomCard from "./customCard";
import { CurrentHumidityField, CurrentPressureField, CurrentTemperatureField } from "../widgets/measureFields";


interface AtmoCardProps {
    label?: string;
    expanded?: boolean;
}

const CurrentAtmoCard: React.FC<AtmoCardProps> = ({ label = "Current atmosphere", expanded = true }) => {
    return (
        <CustomCard title={label} expanded={expanded}>
            <CurrentTemperatureField />
            <CurrentPressureField />
            <CurrentHumidityField />
        </CustomCard>
    );
};

export default CurrentAtmoCard;
