import React from "react";
import CustomCard from "./customCard";
import { useCalculator } from "../../context/profileContext";
import { ZeroTemperatureField } from "../widgets/measureFields";
import { ZeroPressureField } from "../widgets/measureFields/zeroPressureField";
import { ZeroHumidityField } from "../widgets/measureFields/zeroHumidityField";

interface AtmoCardProps {
    label?: string;
    expanded?: boolean;
}

const ZeroAtmoCard: React.FC<AtmoCardProps> = ({ label = "Zero atmosphere", expanded = true }) => {
    const { isLoaded } = useCalculator()

    if (!isLoaded) {
        return <CustomCard title={"Weapon"} expanded={expanded} />
    }
    return (
        <CustomCard title={label} expanded={expanded}>
            <ZeroTemperatureField />
            <ZeroPressureField />
            <ZeroHumidityField />
        </CustomCard>
    );
};

export default ZeroAtmoCard;
