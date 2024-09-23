import React, { useCallback, useContext, useEffect } from "react";
import InputCard from "./inputCard";
import { Unit, UnitProps } from "js-ballistics/dist/v2";
import MeasureFormField, { MeasureFormFieldProps } from "../widgets/measureField";
import { useProfile } from "../../context/profileContext";
import { ActivityIndicator } from "react-native-paper";
import debounce from "../../utils/debounce";

interface AtmoCardProps {
    label?: string;
    expanded?: boolean;
}

const ZeroAtmoCard: React.FC<AtmoCardProps> = ({ label = "Zero atmosphere", expanded = true }) => {

    const { profileProperties, updateProfileProperties } = useProfile();
    const debouncedUpdateProfileProperties = useCallback(debounce(updateProfileProperties, 300), [updateProfileProperties]);

    if (!profileProperties) {
        return (
            <InputCard title={"Zero atmosphere"} expanded={expanded}>
                {/* <ActivityIndicator animating={true} /> */}
            </InputCard>                
        )
    }

    return (
        <InputCard title={label} expanded={expanded}>

            <MeasureFormField
                {...fields.temp}
                value={profileProperties ? profileProperties.cZeroAirTemperature : 0}
                onValueChange={value => debouncedUpdateProfileProperties({ cZeroAirTemperature: Math.round(value) })}
            />

            <MeasureFormField
                {...fields.pressure}
                value={profileProperties ? profileProperties.cZeroAirPressure / 10 : 0}
                onValueChange={value => debouncedUpdateProfileProperties({ cZeroAirPressure: Math.round(value * 10) })}
            />

            <MeasureFormField
                {...fields.humidity}
                value={profileProperties ? profileProperties.cZeroAirHumidity : 0}
                onValueChange={value => debouncedUpdateProfileProperties({ cZeroAirHumidity: Math.round(value) })}
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

export default ZeroAtmoCard;
