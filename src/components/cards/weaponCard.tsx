import { Text, SegmentedButtons, TextInput, useTheme } from "react-native-paper";
import React, { useState } from "react";
import InputCard from "./inputCard";
import SimpleDialog from "../dialogs/simpleDialog";
import { Unit, UnitProps } from "js-ballistics/dist/v2";
import DoubleSpinBox from "../widgets/doubleSpinBox";
import { StyleSheet, View } from "react-native";


export default function WeaponCard({expanded = true}) {

    const theme = useTheme()

    const twistStates = [
        {
            value: 'Right',
            label: 'Right',
            icon: "rotate-right",
            showSelectedCheck: true,
            checkedColor: theme.colors.primary
        },
        {
            value: 'Left',
            label: 'Left',
            icon: "rotate-left",
            showSelectedCheck: true,
            checkedColor: theme.colors.primary
        }
    ]

    const [curTwistDir, setCurTwistDir] = useState("Right");
    const [twistDir, setTwistDir] = useState(curTwistDir);

    const [curName, setCurName] = React.useState("My rifle");
    const [name, setName] = React.useState(curName);

    const acceptTwistDir = (): void => {
        setCurTwistDir(twistDir)
    }

    const declineTwistDir = (): void => {
        setTwistDir(curTwistDir)
    }

    const acceptName = () => {
        setCurName(name)
    }

    const declineName = () => {
        setName(curName)
    }

    return (
        <InputCard title={"Weapon"} expanded={expanded}>
            {/* <View style={{...styles.row, flex: 1}}> */}
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

            {/* </View> */}

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
                        style={[styles.inputContainer, {flex: 2}]}
                        inputProps={{
                            mode: "outlined",
                            dense: true,
                            style: styles.input,
                            contentStyle: [styles.inputContent, {width: "70%"}],
                            right: <TextInput.Affix text={field.suffix} />,
                            left: <TextInput.Icon icon={field.icon} size={16} />
                        }}
                    />
                </View>
            ))}
            
            <View style={styles.row}>
                <Text style={[styles.column, {flex: 1}, styles.label]}>{"Twist direction"}</Text>
                <SegmentedButtons style={[styles.column, { flex: 2, justifyContent: "flex-end" }]}
                    buttons={twistStates} value={twistDir} onValueChange={setTwistDir} />
            </View>
        </InputCard>

    )
}

const fields = [
    {
        key: "diameter",
        label: "Caliber",
        suffix: UnitProps[Unit.Inch].symbol,
        icon: "diameter-variant",
        mode: "float" as const,
        initialValue: 0.308,
        maxValue: 22,
        minValue: 0.001,
        decimals: 3,
    },
    {
        key: "sight_height",
        label: "Sight height",
        suffix: UnitProps[Unit.Inch].symbol,
        icon: "crosshairs",
        mode: "float" as const,
        initialValue: 3,
        maxValue: 5,
        minValue: 0,
        decimals: 1,
    },
    {
        key: "twist",
        label: "Twist",
        suffix: UnitProps[Unit.Inch].symbol,
        icon: "screw-flat-top",
        mode: "float" as const,
        initialValue: 11,
        maxValue: 20,
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