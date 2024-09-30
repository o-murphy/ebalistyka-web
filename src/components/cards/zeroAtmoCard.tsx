import React, { useCallback } from "react";
import CustomCard from "./customCard";
import MeasureFormField from "../widgets/measureFields/measureField/measureField";
import { useProfile } from "../../context/profileContext";
import debounce from "../../utils/debounce";
import { measureFieldsProps } from "../widgets/measureFields/measureField/measureFieldsProperties";
import { UNew, UnitProps, Measure, preferredUnits, Unit } from "js-ballistics/dist/v2";
import { ZeroTemperatureField } from "../widgets/measureFields";
import { ZeroPressureField } from "../widgets/measureFields/zeroPressureField";
import { ZeroHumidityField } from "../widgets/measureFields/zeroHumidityField";

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

            <ZeroTemperatureField />
            <ZeroPressureField />
            <ZeroHumidityField />

        </CustomCard>
    );
};

export default ZeroAtmoCard;
