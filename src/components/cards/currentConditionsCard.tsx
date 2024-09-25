import React, { useCallback } from "react";
import CustomCard from "./customCard";
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
            <CustomCard title={label} expanded={expanded}>
                {/* <ActivityIndicator animating={true} /> */}
            </CustomCard>
        )
    }

    return (
        <CustomCard title={label} expanded={expanded}>

            <MeasureFormField
                {...measureFieldsProps.temp}
                value={currentConditions ? currentConditions.temperature : 0}
                onValueChange={value => debouncedUpdateConditions({ temperature: Math.round(value) })}
            />

            <MeasureFormField
                {...measureFieldsProps.pressure}
                value={currentConditions ? currentConditions.pressure : 0}
                onValueChange={value => debouncedUpdateConditions({ pressure: Math.round(value) })}
            />

            <MeasureFormField
                {...measureFieldsProps.humidity}
                value={currentConditions ? currentConditions.humidity : 0}
                onValueChange={value => debouncedUpdateConditions({ humidity: Math.round(value) })}
            />

            <MeasureFormField
                {...measureFieldsProps.lookAngle}
                value={currentConditions ? currentConditions.lookAngle / 10 : 0}
                onValueChange={value => debouncedUpdateConditions({ lookAngle: Math.round(value * 10) })}
            />

        </CustomCard>
    );
};

export default CurrentConditionsCard;
