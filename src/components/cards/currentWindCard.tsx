import { TextInput } from "react-native-paper";
import React, { useContext } from "react";
import InputCard from "./inputCard";
import { Unit, UnitProps } from "js-ballistics/dist/v2";
import DoubleSpinBox from "../widgets/doubleSpinBox";
import WindDirectionPicker from "../widgets/windDirectionPicker";
import { MeasureFormFieldProps, inputStyles, iconSize, inputSideStyles, styles as measureFormFieldStyles } from "../widgets/measureField";
import { ProfileContext } from "../../providers/profileProvider";

interface WindCardProps {
    label?: string;
    expanded?: boolean;
}

const CurrentWindCard: React.FC<WindCardProps> = ({ label = "Zero wind direction and speed", expanded = true }) => {
    const { currentConditions, updateCurrentConditions } = useContext(ProfileContext);
    
    return (
        <InputCard title={label} expanded={expanded}>
            <WindDirectionPicker
                style={{ alignItems: 'center' }}
                value={currentConditions ? currentConditions.windDirection : 0}
                onChange={value => updateCurrentConditions({windDirection: value === 12 ? 0 : value})}
            />

            <DoubleSpinBox
                value={fields.windSpeed.value}
                onValueChange={(value) => console.log(value)} // TODO:
                fractionDigits={fields.windSpeed.fractionDigits}
                minValue={fields.windSpeed.minValue}
                maxValue={fields.windSpeed.maxValue}
                step={fields.windSpeed.step}
                style={{ ...measureFormFieldStyles.doubleSpinBox, width: "70%", alignSelf: "center" }}
                inputProps={{
                    mode: "outlined",
                    dense: true,
                    ...inputStyles,
                    right: <TextInput.Affix text={fields.windSpeed.suffix} textStyle={inputSideStyles.affix} />,
                    left: <TextInput.Icon icon={fields.windSpeed.icon} size={iconSize} style={inputSideStyles.icon} />
                }}
            />
        </InputCard>
    );
};

const fields: Record<string, MeasureFormFieldProps> = {
    windSpeed: {
        key: "windSpeed",
        label: "Wind speed",
        suffix: UnitProps[Unit.MPS].symbol,
        icon: "windsock",
        value: 0,
        maxValue: 100,
        minValue: 0,
        fractionDigits: 1,
        step: 0.1
    },
}

export default CurrentWindCard;
