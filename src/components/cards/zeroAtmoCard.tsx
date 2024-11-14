import React from "react";
import CustomCard from "./customCard";
import { useProfile } from "../../context/profileContext";
import { DimensionDialogChip, NumericDialogChip } from "../../screens/desktop/components";
import { Divider } from "react-native-paper";

interface AtmoCardProps {
    label?: string;
    expanded?: boolean;
}

const ZeroAtmoCard: React.FC<AtmoCardProps> = ({ label = "Zero atmosphere", expanded = true }) => {
    const { isLoaded, cZeroAirHumidity, cZeroAirTemperature, cZeroAirPressure, cZeroPTemperature } = useProfile()

    if (!isLoaded) {
        return <CustomCard title={label} expanded={expanded} />
    }
    return (
        <CustomCard title={label} expanded={expanded}>
            <DimensionDialogChip icon={"thermometer"} title={"Temperature"} dimension={cZeroAirTemperature} />
            <Divider />
            <DimensionDialogChip icon={"gauge"} title={"Pressure"} dimension={cZeroAirPressure} />
            <Divider />
            <NumericDialogChip icon="water" title="humidity" numeral={cZeroAirHumidity} />
            <Divider />
            <DimensionDialogChip icon="thermometer" title="Powder temperature" dimension={cZeroPTemperature} />
        </CustomCard>
    );
};

export default ZeroAtmoCard;
