import { Text, TextInput } from "react-native-paper";
import React, { useState } from "react";
import InputCard from "./inputCard";
import SimpleDialog from "../dialogs/simpleDialog";
import { Unit, UnitProps } from "js-ballistics/dist/v2";
import { StyleSheet, View } from "react-native";
import DoubleSpinBox from "../widgets/doubleSpinBox";
import WindDirectionPicker from "../widgets/windDirectionPicker";


export default function WindCard({label = "Zero wind direction and speed", expanded=true}) {

    const me = WindCard.name

    const [curWindDir, setCurWindDir] = useState(0)
    const [windDir, setWindDir] = useState(curWindDir / 30)

    const onWindDirChange = (value) => {
        setWindDir(value === 12 ? 0 : value)
    }

    const onWindAccept = () => {
        setCurWindDir(windDir * 30)
    }

    const onWindDecline = () => {
        setWindDir(curWindDir / 30)
    }

    const getWindIcon = () => {
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

        }
    }

    return (

        <InputCard title={label} expanded={expanded}>
            
            <WindDirectionPicker
                style={{ alignItems: 'center' }}
                value={windDir}
                onChange={onWindDirChange} />

            <DoubleSpinBox
                value={fields[0].initialValue}
                onValueChange={value => console.log(value)}
                fixedPoints={fields[0].decimals}
                min={fields[0].minValue}
                max={fields[0].maxValue}
                step={1}
                style={{...styles.inputContainer, alignItems: 'center' }}
                inputProps={{
                    mode: "outlined",
                    dense: true,
                    style: styles.input,
                    contentStyle: styles.inputContent,
                    right: <TextInput.Affix text={fields[0].suffix} />,
                    left: <TextInput.Icon icon={fields[0].icon} size={16} />
                }}
            />

        </InputCard>
    )
}

const fields = [
    {
        key: "windSpeed",
        label: "Wind speed",
        suffix: UnitProps[Unit.MPS].symbol,
        icon: "windsock",
        mode: "float" as const,
        initialValue: 0,
        maxValue: 100,
        minValue: 0,
        decimals: 1,
    }
]

const styles = StyleSheet.create({
    column: {
        flex: 1,
        flexDirection: "row",
        marginHorizontal: 8
    },
    row: {
        flex: 1,
        flexDirection: "row",
        marginVertical: 8,
        alignItems: 'center',
    },
    inputContainer: {
        flex: 1, // Input takes up 1 portions of the width
        justifyContent: 'center',
    },
    input: {
        width: '80%',
        height: 32,
    },
    inputContent: {
        fontSize: 14
    },
    nameContainer: {
        flex: 1,
        marginVertical: 8,
    },
    label: { fontSize: 16 }
})