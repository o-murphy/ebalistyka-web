import React, { useContext, useEffect } from "react";
import InputCard from "./inputCard";
import { Unit, UnitProps } from "js-ballistics/dist/v2";
import MeasureFormField, { MeasureFormFieldProps } from "../widgets/measureField";
import { ProfileContext as ProfileContext } from "../../providers/profileProvider";
import { ActivityIndicator } from "react-native-paper";

interface AtmoCardProps {
    label?: string;
    expanded?: boolean;
}

const CurrentAtmoCard: React.FC<AtmoCardProps> = ({ label = "Zero atmosphere", expanded = true }) => {

    const { currentConditions, updateCurrentConditions } = useContext(ProfileContext);
    
    if (!currentConditions) {
        return (
            <InputCard title={"Weapon"} expanded={expanded}>
                <ActivityIndicator animating={true} />
            </InputCard>                
        )
    }
    
    return (
        <InputCard title={label} expanded={expanded}>

            <MeasureFormField
                {...fields.temp}
                value={currentConditions ? currentConditions.temperature : 0}
                onValueChange={value => updateCurrentConditions({ cZeroAirTemperature: Math.round(value) })}
            />

            <MeasureFormField
                {...fields.pressure}
                value={currentConditions ? currentConditions.pressure : 0}
                onValueChange={value => updateCurrentConditions({ cZeroAirPressure: Math.round(value) })}
            />

            <MeasureFormField
                {...fields.humidity}
                value={currentConditions ? currentConditions.humidity : 0}
                onValueChange={value => updateCurrentConditions({ cZeroAirHumidity: Math.round(value) })}
            />

        </InputCard>
    );
};

const fields: Record<string, MeasureFormFieldProps> = {
    temp: {
        key: "cZeroAirTemperature",
        label: "Temperature",
        suffix: UnitProps[Unit.Celsius].symbol,
        icon: "thermometer",
        maxValue: 50,
        minValue: -50,
        fractionDigits: 0,
        value: 15,
    },
    pressure: {
        key: "pressure",
        label: "Pressure",
        suffix: UnitProps[Unit.hPa].symbol,
        icon: "speedometer",
        maxValue: 1300,
        minValue: 700,
        fractionDigits: 0,
        value: 1000,
    },
    humidity: {
        key: "humidity",
        label: "Humidity",
        suffix: "%",
        icon: "water",
        maxValue: 100,
        minValue: 0,
        fractionDigits: 0,
        value: 78,
    },
    // altitude: {
    //     key: "altitude",
    //     label: "Altitude",
    //     suffix: UnitProps[Unit.Meter].symbol,
    //     icon: "ruler",
    //     maxValue: 3000,
    //     minValue: 0,
    //     decimals: 0,
    //     value: 150,
    // },
};

export default CurrentAtmoCard;
