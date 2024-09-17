import { Text, TextInput, useTheme } from "react-native-paper";
import React, { useState } from "react";
import InputCard from "./inputCard";
import SimpleDialog from "../dialogs/simpleDialog";
import { Unit, UnitProps } from "js-ballistics/dist/v2";
import DoubleSpinBox from "../widgets/doubleSpinBox";
import { StyleSheet, View } from "react-native";

export default function ProjectileCard() {

    const me = ProjectileCard.name

    const theme = useTheme()

    const [curName, setCurName] = React.useState("My projectile");
    const [name, setName] = React.useState(curName);

    const acceptName = () => {
        setCurName(name)
    }

    const declineName = () => {
        setName(curName)
    }

    return (

        <InputCard title={"Projectile"}>

            <SimpleDialog
                style={styles.nameContainer}
                label={"Name"}
                icon={"card-bulleted-outline"}
                text={curName}
                onAccept={acceptName}
                onDecline={declineName}
            >
                <TextInput value={name} onChangeText={setName} />
            </SimpleDialog>

            {fields.map(field => (
                <View style={styles.row}>
                    <Text style={[styles.column, styles.label]}>{field.label}</Text>
                    <DoubleSpinBox
                        value={field.initialValue}
                        onValueChange={value => console.log(value)}
                        fixedPoints={field.decimals}
                        min={field.minValue}
                        max={field.maxValue}
                        step={1}
                        style={[styles.inputContainer]}
                        inputProps={{
                            mode: "outlined",
                            dense: true,
                            style: styles.input,
                            contentStyle: styles.inputContent,
                            right: <TextInput.Affix text={field.suffix} />,
                            left: <TextInput.Icon icon={field.icon} />
                        }}
                    />
                </View>
            ))}

        </InputCard>

    )
}


const fields = [
    {
        key: "mv",
        label: "Muzzle velocity",
        suffix: UnitProps[Unit.MPS].symbol,
        icon: "speedometer",
        mode: "int" as const,
        initialValue: 805,
        maxValue: 2000,
        minValue: 10,
        decimals: 0,
    },
    // {
    //     key: "powder_temp",
    //     label: "Powder temperature",
    //     suffix: UnitProps[Unit.Celsius].symbol,
    //     icon: "thermometer",
    //     mode: "int" as const,
    //     initialValue: 15,
    //     maxValue: 50,
    //     minValue: -50,
    //     decimals: 0,
    // },
    {
        key: "powder_sens",
        label: "Temperature coefficient",
        suffix: "/15°C",
        icon: "percent",
        mode: "float" as const,
        initialValue: 1,
        maxValue: 5,
        minValue: 0,
        decimals: 2,
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