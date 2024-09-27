import React, { useCallback } from "react";
import CustomCard from "./customCard";
import MeasureFormField from "../widgets/measureFields/measureField/measureField";
import { useProfile } from "../../context/profileContext";
import debounce from "../../utils/debounce";
import { measureFieldsProps } from "../widgets/measureFields/measureField/measureFieldsProperties";
import { Measure, UNew, Unit, UnitProps } from "js-ballistics";
import { preferredUnits } from "js-ballistics/dist/v2";

interface AtmoCardProps {
    label?: string;
    expanded?: boolean;
}

const CurrentConditionsCard: React.FC<AtmoCardProps> = ({ label = "Zero atmosphere", expanded = true }) => {

    const { currentConditions, updateCurrentConditions } = useProfile();
    const debouncedUpdateConditions = useCallback(debounce(updateCurrentConditions, 350), [updateCurrentConditions]);

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
                suffix={UnitProps[preferredUnits.temperature].symbol}
                value={currentConditions ? UNew.Celsius(currentConditions.temperature).In(preferredUnits.temperature) : 0}
                onValueChange={value => debouncedUpdateConditions({ temperature: Math.round(new Measure.Temperature(value, preferredUnits.temperature).In(Unit.Celsius)) })}
            />

            <MeasureFormField
                {...measureFieldsProps.pressure}
                suffix={UnitProps[preferredUnits.pressure].symbol}
                value={currentConditions ? UNew.hPa(currentConditions.pressure).In(preferredUnits.pressure) : 0}
                onValueChange={value => debouncedUpdateConditions({ pressure: Math.round(new Measure.Pressure(value, preferredUnits.pressure).In(Unit.hPa)) })}            
            />

            <MeasureFormField
                {...measureFieldsProps.humidity}
                value={currentConditions ? currentConditions.humidity : 0}
                onValueChange={value => debouncedUpdateConditions({ humidity: Math.round(value) })}            
            />

            <MeasureFormField
                {...measureFieldsProps.lookAngle}
                suffix={UnitProps[preferredUnits.angular].symbol}
                value={currentConditions ? UNew.Degree(currentConditions.lookAngle / 10).In(preferredUnits.angular) : 0}
                onValueChange={value => debouncedUpdateConditions({ lookAngle: Math.round(new Measure.Angular(value, preferredUnits.angular).In(Unit.Degree) * 10) })}
            />

        </CustomCard>
    );
};

export default CurrentConditionsCard;
