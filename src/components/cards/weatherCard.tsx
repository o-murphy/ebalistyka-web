import React from "react";
import { Divider } from "react-native-paper";
import CustomCard from "./customCard";
import { useProfile } from "../../context/profileContext";
import { DimensionDialogChip, NumericDialogChip } from "../widgets";


interface WeatherCard {
    title?: string;
}

const WeatherCard: React.FC<WeatherCard> = ({ title = "Zero atmosphere" }) => {
    const { isLoaded, cZeroAirHumidity, cZeroAirTemperature, cZeroAirPressure, cZeroPTemperature } = useProfile()

    if (!isLoaded) {
        return <CustomCard title={title} />
    }

    return (
        <CustomCard title={title} >
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

export default WeatherCard;
