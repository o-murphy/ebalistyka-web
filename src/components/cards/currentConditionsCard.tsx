import React, { useCallback } from "react";
import InputCard from "./inputCard";
import MeasureFormField from "../widgets/measureField";
import { useProfile } from "../../context/profileContext";
import debounce from "../../utils/debounce";
import { measureFieldsProps } from "../widgets/measureFieldsProperties";

interface AtmoCardProps {
    label?: string;
    expanded?: boolean;
}

const CurrentConditionsCard: React.FC<AtmoCardProps> = ({ label = "Zero atmosphere", expanded = true }) => {

    const { currentConditions, updateCurrentConditions } = useProfile();
    const debouncedUpdateConditions = useCallback(debounce(updateCurrentConditions, 300), [updateCurrentConditions]);

    if (!currentConditions) {
        return (
            <InputCard title={label} expanded={expanded}>
                {/* <ActivityIndicator animating={true} /> */}
            </InputCard>
        )
    }

    return (
        <InputCard title={label} expanded={expanded}>

            <MeasureFormField
                {...measureFieldsProps.temp}
                value={currentConditions ? currentConditions.temperature : 0}
                onValueChange={value => debouncedUpdateConditions({ cZeroAirTemperature: Math.round(value) })}
            />

            <MeasureFormField
                {...measureFieldsProps.pressure}
                value={currentConditions ? currentConditions.pressure : 0}
                onValueChange={value => debouncedUpdateConditions({ cZeroAirPressure: Math.round(value) })}
            />

            <MeasureFormField
                {...measureFieldsProps.humidity}
                value={currentConditions ? currentConditions.humidity : 0}
                onValueChange={value => debouncedUpdateConditions({ cZeroAirHumidity: Math.round(value) })}
            />

            <MeasureFormField
                {...measureFieldsProps.lookAngle}
                value={currentConditions ? currentConditions.lookAngle / 10 : 0}
                onValueChange={value => debouncedUpdateConditions({ lookAngle: Math.round(value * 10) })}
            />

        </InputCard>
    );
};

export default CurrentConditionsCard;
