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
                value={profileProperties ? profileProperties.cZeroAirTemperature : 0}
                onValueChange={value => debouncedUpdateProfileProperties({ cZeroAirTemperature: Math.round(value) })}
            />

            <MeasureFormField
                {...measureFieldsProps.pressure}
                value={profileProperties ? profileProperties.cZeroAirPressure / 10 : 0}
                onValueChange={value => debouncedUpdateProfileProperties({ cZeroAirPressure: Math.round(value * 10) })}
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
