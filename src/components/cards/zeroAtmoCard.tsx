import React from "react";
import CustomCard from "./customCard";
import { useCalculator } from "../../context/profileContext";
import { ZeroTemperatureField } from "../widgets/measureFields";
import { ZeroPressureField } from "../widgets/measureFields/zeroPressureField";
import { ZeroHumidityField } from "../widgets/measureFields/zeroHumidityField";
import { DimensionDialogChip, NumericDialogChip } from "../../screens/desktop/components";
import { Divider } from "react-native-paper";

interface AtmoCardProps {
    label?: string;
    expanded?: boolean;
}

const ZeroAtmoCard: React.FC<AtmoCardProps> = ({ label = "Zero atmosphere", expanded = true }) => {
    const { isLoaded, cZeroAirHumidity, cZeroAirTemperature, cZeroAirPressure } = useCalculator()

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

        </CustomCard>
    );
};

export default ZeroAtmoCard;
