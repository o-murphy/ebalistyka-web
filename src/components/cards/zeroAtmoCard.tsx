import React, { useCallback } from "react";
import CustomCard from "./customCard";
import MeasureFormField from "../widgets/measureField";
import { useProfile } from "../../context/profileContext";
import debounce from "../../utils/debounce";
import { measureFieldsProps } from "../widgets/measureFieldsProperties";
import { UNew, UnitProps, Measure, preferredUnits, Unit } from "js-ballistics/dist/v2";

interface AtmoCardProps {
    label?: string;
    expanded?: boolean;
}

const ZeroAtmoCard: React.FC<AtmoCardProps> = ({ label = "Zero atmosphere", expanded = true }) => {

    const { profileProperties, updateProfileProperties } = useProfile();
    const debouncedUpdateProfileProperties = useCallback(debounce(updateProfileProperties, 350), [updateProfileProperties]);

    if (!profileProperties) {
        return (
            <CustomCard title={"Zero atmosphere"} expanded={expanded}>
                {/* <ActivityIndicator animating={true} /> */}
            </CustomCard>
        )
    }

    return (
        <CustomCard title={label} expanded={expanded}>

            <MeasureFormField
                {...measureFieldsProps.temp}
                suffix={UnitProps[preferredUnits.temperature].symbol}
                value={profileProperties ? UNew.Celsius(profileProperties.cZeroAirTemperature).In(preferredUnits.temperature) : 0}
                onValueChange={value => debouncedUpdateProfileProperties({ cZeroAirTemperature: Math.round(new Measure.Temperature(value, preferredUnits.temperature).In(Unit.Celsius)) })}
            />

            <MeasureFormField
                {...measureFieldsProps.pressure}
                suffix={UnitProps[preferredUnits.pressure].symbol}
                value={profileProperties ? UNew.hPa(profileProperties.cZeroAirPressure / 10).In(preferredUnits.pressure) : 0}
                onValueChange={value => debouncedUpdateProfileProperties({ cZeroAirPressure: Math.round(new Measure.Pressure(value, preferredUnits.pressure).In(Unit.hPa) * 10) })}            
            />

            <MeasureFormField
                {...measureFieldsProps.humidity}
                value={profileProperties ? profileProperties.cZeroAirHumidity : 0}
                onValueChange={value => debouncedUpdateProfileProperties({ cZeroAirHumidity: Math.round(value) })}            
            />

        </CustomCard>
    );
};

export default ZeroAtmoCard;
