import React from "react";
import CustomCard from "./customCard";
import { useProfile } from "../../context/profileContext";
import { ZeroTemperatureField } from "../widgets/measureFields";
import { ZeroPressureField } from "../widgets/measureFields/zeroPressureField";
import { ZeroHumidityField } from "../widgets/measureFields/zeroHumidityField";

interface AtmoCardProps {
    label?: string;
    expanded?: boolean;
}

const ZeroAtmoCard: React.FC<AtmoCardProps> = ({ label = "Zero atmosphere", expanded = true }) => {

    const { profileProperties } = useProfile();

    if (!profileProperties) {
        return (
            <CustomCard title={"Zero atmosphere"} expanded={expanded}>
                {/* <ActivityIndicator animating={true} /> */}
            </CustomCard>
        )
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
