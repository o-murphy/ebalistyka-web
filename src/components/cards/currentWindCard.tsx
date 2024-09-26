import { TextInput } from "react-native-paper";
import React, { useCallback, useEffect, useState } from "react";
import CustomCard from "./customCard";
import DoubleSpinBox from "../widgets/doubleSpinBox";
import WindDirectionPicker from "../widgets/windDirectionPicker";
import { iconSize, inputSideStyles } from "../widgets/measureField";
import { useProfile } from "../../context/profileContext";
import debounce from "../../utils/debounce";
import { measureFieldsProps } from "../widgets/measureFieldsProperties";

interface WindCardProps {
    label?: string;
    expanded?: boolean;
}

const CurrentWindCard: React.FC<WindCardProps> = ({ label = "Zero wind direction and speed", expanded = true }) => {
    const { currentConditions, updateCurrentConditions } = useProfile();
    const debouncedUpdateConditions = useCallback(debounce(updateCurrentConditions, 350), [updateCurrentConditions]);

    const [windDir, setWindDir] = useState(currentConditions.windDirection)
    const [windSpeed, setWindSpeed] = useState(currentConditions.windSpeed)

    useEffect(() => {
        if (windSpeed != 0) {
            debouncedUpdateConditions({windDirection: windDir, windSpeed: windSpeed})
        }
    }, [windDir, windSpeed])

    return (
        <CustomCard title={label} expanded={expanded}>
            <WindDirectionPicker
                style={{ alignItems: 'center' }}
                value={windDir}
                onChange={setWindDir}
            />

            <DoubleSpinBox
                value={windSpeed}
                onValueChange={setWindSpeed} // TODO:
                fractionDigits={measureFieldsProps.windSpeed.fractionDigits}
                minValue={measureFieldsProps.windSpeed.minValue}
                maxValue={measureFieldsProps.windSpeed.maxValue}
                step={measureFieldsProps.windSpeed.step}
                // style={{ ...measureFormFieldStyles.doubleSpinBox, width: "70%", alignSelf: "center" }}
                inputProps={{
                    label: "Wind speed",
                    mode: "outlined",
                    dense: true,
                    // ...inputStyles,
                    right: <TextInput.Affix text={measureFieldsProps.windSpeed.suffix} textStyle={inputSideStyles.affix} />,
                    left: <TextInput.Icon icon={measureFieldsProps.windSpeed.icon} size={iconSize} style={inputSideStyles.icon} />
                }}
            />
        </CustomCard>
    );
};

export default CurrentWindCard;
