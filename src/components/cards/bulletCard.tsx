import {Text, TextInput, Chip} from "react-native-paper";
import React from "react";
import InputCard from "./inputCard";
import SimpleDialog from "../dialogs/simpleDialog";
import {Unit, UnitProps} from "js-ballistics/dist/v2";
import { View } from "react-native";
import MeasureFormField, {MeasureFormFieldProps, styles as measureFormFieldStyles} from "../widgets/measureField";

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
                style={measureFormFieldStyles.nameContainer}
                label={"Name"} 
                icon={"card-bulleted-outline"}
                text={curName}
                onAccept={acceptName}
                onDecline={declineName}
            >
                <TextInput value={name} onChangeText={setName}/>
            </SimpleDialog>

            {fields.map(field => <MeasureFormField key={field.key} field={field} />)}


            <View style={measureFormFieldStyles.row}>
                <Text style={[measureFormFieldStyles.column, {flex: 1}, measureFormFieldStyles.label]}>{"Drag model"}</Text>
                <Chip 
                icon={"function"} 
                closeIcon="square-edit-outline" 
                style={[measureFormFieldStyles.column, {flex: 2}]} 
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


const fields: MeasureFormFieldProps[] = [
    {
        key: "weight",
        label: "Weight",
        suffix: UnitProps[Unit.Grain].symbol,
        icon: "weight",
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
        initialValue: 1.7,
        maxValue: 5,
        minValue: 0,
        decimals: 2,
    },
]