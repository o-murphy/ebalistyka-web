import React from "react";
import InputCard from "./inputCard";
import {Unit, UnitProps} from "js-ballistics/dist/v2";
import {StyleSheet, View, } from 'react-native'
import { TextInput, Text } from "react-native-paper";
import DoubleSpinBox from "../widgets/doubleSpinBox";
import SimpleDialog from "../dialogs/simpleDialog";


export default function AtmoCard({label = "Zero atmosphere", expanded = true}) {

    const me = AtmoCard.name

    const [curName, setCurName] = React.useState("My rifle");
    const [name, setName] = React.useState(curName);

    const acceptName = () => {
        setCurName(name)
    }

    const declineName = () => {
        setName(curName)
    }

    return (
        <InputCard title={label} expanded={expanded}>

            {fields.map(field => (
                <View style={styles.row}>
                    <Text style={[styles.column, {flex: 1}, styles.label]}>{field.label}</Text>
                    <DoubleSpinBox
                        value={field.initialValue}
                        onValueChange={value => console.log(value)}
                        fixedPoints={field.decimals}
                        min={field.minValue}
                        max={field.maxValue}
                        step={1}
                        style={[styles.inputContainer, {flex: 2}, ]}
                        inputProps={{
                            mode: "outlined",
                            dense: true,
                            style: styles.input,
                            contentStyle: styles.inputContent,
                            right: <TextInput.Affix text={field.suffix} />,
                            left: <TextInput.Icon icon={field.icon} size={16} />
                        }}
                    />
                </View>
            ))}
            
        </InputCard>

    )
}

const fields = [
    {
        key: "temp",
        label: "Temperature",
        suffix: UnitProps[Unit.Celsius].symbol,
        icon: "thermometer",
        mode: "int" as const,
        initialValue: 15,
        maxValue: 50,
        minValue: -50,
        decimals: 0
    },
    {
        key: "pressure",
        label: "Pressure",
        suffix: UnitProps[Unit.MmHg].symbol,
        icon: "speedometer",
        mode: "int" as const,
        initialValue: 760,
        maxValue: 1000,
        minValue: 700,
        decimals: 0
    },
    {
        key: "humidity",
        label: "Humidity",
        suffix: "%",
        icon: "water",
        mode: "int" as const,
        initialValue: 78,
        maxValue: 100,
        minValue: 0,
        decimals: 0
    },
    {
        key: "altitude",
        label: "Altitude",
        suffix: UnitProps[Unit.Meter].symbol,
        icon: "ruler",
        mode: "int" as const,
        initialValue: 150,
        maxValue: 3000,
        minValue: 0,
        decimals: 0,
    },
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
        // height: 20,
    },
    input: {
        width: '100%',
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