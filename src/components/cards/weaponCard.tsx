import { Text, SegmentedButtons, TextInput, useTheme } from "react-native-paper";
import React, { useState } from "react";
import InputCard from "./inputCard";
import SimpleDialog from "../dialogs/simpleDialog";
import { Unit, UnitProps } from "js-ballistics/dist/v2";
import { StyleSheet, View } from "react-native";
import MeasureFormField, {MeasureFormFieldProps, styles as measureFormFieldStyles} from "../widgets/measureField";


export default function WeaponCard({expanded = true}) {

    const theme = useTheme()

    const twistStates = [
        {
            value: 'Right',
            label: 'Right',
            icon: "rotate-right",
            showSelectedCheck: true,
            checkedColor: theme.colors.primary,
            style: styles.buttons
        },
        {
            value: 'Left',
            label: 'Left',
            icon: "rotate-left",
            showSelectedCheck: true,
            checkedColor: theme.colors.primary,
            style: styles.buttons
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

            <SimpleDialog
                style={measureFormFieldStyles.nameContainer}
                label={"Name"}
                icon={"card-bulleted-outline"}
                text={curName}
                onAccept={acceptName}
                onDecline={declineName}
            >
                <TextInput value={name} onChangeText={setName} />
            </SimpleDialog>

            {fields.map(field => <MeasureFormField key={field.key} field={field} />)}
            
            <View style={{...measureFormFieldStyles.row, }}>
                <Text style={[measureFormFieldStyles.column,  measureFormFieldStyles.label]}>{"Twist direction"}</Text>
                <SegmentedButtons 
                    style={[measureFormFieldStyles.column, styles.segment]}
                    buttons={twistStates} value={twistDir} onValueChange={setTwistDir} />
            </View>
        </InputCard>

    )
}

const styles = StyleSheet.create({
    segment: {
        flex: 2, 
        justifyContent: "center"
    },
    buttons: {

    }
})

const fields: MeasureFormFieldProps[] = [
    {
        key: "diameter",
        label: "Caliber",
        suffix: UnitProps[Unit.Inch].symbol,
        icon: "diameter-variant",
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
        initialValue: 11,
        maxValue: 20,
        minValue: 0,
        decimals: 2,
    },
]