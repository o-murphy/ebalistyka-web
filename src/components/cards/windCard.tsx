import { TextInput } from "react-native-paper";
import React, { useState } from "react";
import InputCard from "./inputCard";
import { Unit, UnitProps } from "js-ballistics/dist/v2";
import DoubleSpinBox from "../widgets/doubleSpinBox";
import WindDirectionPicker from "../widgets/windDirectionPicker";
import { MeasureFormFieldProps, inputStyles, iconSize, inputSideStyles, styles as measureFormFieldStyles } from "../widgets/measureField";

interface WindCardProps {
    label?: string;
    expanded?: boolean;
}

const WindCard: React.FC<WindCardProps> = ({ label = "Zero wind direction and speed", expanded = true }) => {
    const [curWindDir, setCurWindDir] = useState<number>(0);
    const [windDir, setWindDir] = useState<number>(curWindDir / 30);

    const onWindDirChange = (value: number) => {
        setWindDir(value === 12 ? 0 : value);
    };

    const onWindAccept = (): void => {
        setCurWindDir(windDir * 30);
    };

    const onWindDecline = (): void => {
        setWindDir(curWindDir / 30);
    };

    const getWindIcon = (): string => {
        switch (curWindDir / 30) {
            case 12:
                return "clock-time-twelve-outline";
            case 11:
                return "clock-time-eleven-outline";
            case 10:
                return "clock-time-ten-outline";
            case 9:
                return "clock-time-nine-outline";
            case 8:
                return "clock-time-eight-outline";
            case 7:
                return "clock-time-seven-outline";
            case 6:
                return "clock-time-six-outline";
            case 5:
                return "clock-time-five-outline";
            case 4:
                return "clock-time-four-outline";
            case 3:
                return "clock-time-three-outline";
            case 2:
                return "clock-time-two-outline";
            case 1:
                return "clock-time-one-outline";
            case 0:
                return "clock-time-twelve-outline";
            default:
                return "clock-time-twelve-outline"; // Fallback
        }
    };

    return (
        <InputCard title={label} expanded={expanded}>
            <WindDirectionPicker
                style={{ alignItems: 'center' }}
                value={windDir}
                onChange={onWindDirChange}
            />

            <DoubleSpinBox
                value={fields[0].initialValue}
                onValueChange={(value) => console.log(value)} // TODO:
                fixedPoints={fields[0].decimals}
                min={fields[0].minValue}
                max={fields[0].maxValue}
                step={1}
                style={{ ...measureFormFieldStyles.doubleSpinBox, width: "70%", alignSelf: "center" }}
                inputProps={{
                    mode: "outlined",
                    dense: true,
                    ...inputStyles,
                    right: <TextInput.Affix text={fields[0].suffix} textStyle={inputSideStyles.affix} />,
                    left: <TextInput.Icon icon={fields[0].icon} size={iconSize} style={inputSideStyles.icon} />
                }}
            />
        </InputCard>
    );
};

const fields: MeasureFormFieldProps[] = [
    {
        key: "windSpeed",
        label: "Wind speed",
        suffix: UnitProps[Unit.MPS].symbol,
        icon: "windsock",
        initialValue: 0,
        maxValue: 100,
        minValue: 0,
        decimals: 1,
    },
];

export default WindCard;
