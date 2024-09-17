import {Text, TextInput, Chip} from "react-native-paper";
import React from "react";
import InputCard from "./inputCard";
import SimpleDialog from "../dialogs/simpleDialog";
import {Unit, UnitProps} from "js-ballistics/dist/v2";
import { StyleSheet, View } from "react-native";
import DoubleSpinBox from "../widgets/doubleSpinBox";


export default function BulletCard({expanded = true}) {

    const me = BulletCard.name

    const [curName, setCurName] = React.useState("My bullet");
    const [name, setName] = React.useState(curName);

    const acceptName = () => {
        setCurName(name)
    }

    const declineName = () => {
        setName(curName)
    }

    const editDragModel = () => {
        // navigate("DragModelScreen")
        console.log("Edit drag model")
    }

    return (

        <InputCard title={"Bullet"} expanded={expanded}>

            <SimpleDialog 
                style={styles.nameContainer}
                label={"Name"} 
                icon={"card-bulleted-outline"}
                text={curName}
                onAccept={acceptName}
                onDecline={declineName}
            >
                <TextInput value={name} onChangeText={setName}/>
            </SimpleDialog>

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
                            contentStyle: styles.inputContent,
                            right: <TextInput.Affix text={field.suffix} />,
                            left: <TextInput.Icon icon={field.icon} size={16} />
                        }}
                    />
                </View>
            ))}

            <View style={styles.row}>
                <Text style={[styles.column, {flex: 1}, styles.label]}>{"Drag model"}</Text>
                <Chip 
                icon={"function"} 
                closeIcon="square-edit-outline" 
                style={[styles.column, {flex: 2}]} 
                textStyle={{fontSize: 16}}
                        onPress={editDragModel}
                        onClose={editDragModel}
                >
                    {`0.318 G7`}
                </Chip>
            </View>

        </InputCard>

    )
}


const fields = [
    // {
    //     key: "diameter",
    //     label: "Diameter",
    //     suffix: UnitProps[Unit.Inch].symbol,
    //     icon: "diameter-variant",
    //     mode: "float" as const,
    //     initialValue: 0.308,
    //     maxValue: 22,
    //     minValue: 0.001,
    //     decimals: 3,
    // },
    {
        key: "weight",
        label: "Weight",
        suffix: UnitProps[Unit.Grain].symbol,
        icon: "weight",
        mode: "float" as const,
        initialValue: 15,
        maxValue: 50,
        minValue: -50,
        decimals: 1,
    },
    {
        key: "length",
        label: "Length",
        suffix: UnitProps[Unit.Inch].symbol,
        icon: "arrow-expand-horizontal",
        mode: "float" as const,
        initialValue: 1.7,
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