import React, { useContext, useEffect } from "react";
import InputCard from "./inputCard";
import { Unit, UnitProps } from "js-ballistics/dist/v2";
import MeasureFormField, { MeasureFormFieldProps } from "../widgets/measureField";
import { ProfileContext as ProfileContext } from "../../providers/profileLoaderProvider";

interface AtmoCardProps {
    label?: string;
    expanded?: boolean;
}

const AtmoCard: React.FC<AtmoCardProps> = ({ label = "Zero atmosphere", expanded = true }) => {

    const { fileContent, updateProfileProperties } = useContext(ProfileContext);

    return (
        <InputCard title={label} expanded={expanded}>
            {/* {fields.map(field => (
                <MeasureFormField key={field.key} field={field} />
            ))} */}

            <MeasureFormField
                {...fields.temp}
                value={fileContent ? fileContent.cZeroAirTemperature : 0}
                onValueChange={value => updateProfileProperties({ cZeroAirTemperature: Math.round(value) })}
            />

            <MeasureFormField
                {...fields.pressure}
                value={fileContent ? fileContent.cZeroAirPressure / 10 : 0}
                onValueChange={value => updateProfileProperties({ cZeroAirPressure: Math.round(value * 10) })}
            />

            <MeasureFormField
                {...fields.humidity}
                value={fileContent ? fileContent.cZeroAirHumidity : 0}
                onValueChange={value => updateProfileProperties({ cZeroAirHumidity: Math.round(value) })}
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
        decimals: 0,
        value: 15,
    },
    pressure: {
        key: "pressure",
        label: "Pressure",
        suffix: UnitProps[Unit.hPa].symbol,
        icon: "speedometer",
        maxValue: 1300,
        minValue: 700,
        decimals: 0,
        value: 1000,
    },
    humidity: {
        key: "humidity",
        label: "Humidity",
        suffix: "%",
        icon: "water",
        maxValue: 100,
        minValue: 0,
        decimals: 0,
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

export default AtmoCard;
