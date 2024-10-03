import { Text, Chip } from "react-native-paper";
import React from "react";
import CustomCard from "./customCard";
import { StyleSheet, View } from "react-native";
import { useCalculator } from "../../context/profileContext";
import { BulletLengthField, BulletWeightField, CaliberField } from "../widgets/measureFields";
import { TextInputChip } from "../widgets/inputChip";

interface BulletCardProps {
    expanded?: boolean;
}

const BulletCard: React.FC<BulletCardProps> = ({ expanded = true }) => {
    const { profileProperties, updateProfileProperties, calcState } = useCalculator();

    const editDragModel = () => {
        // navigate("DragModelScreen")
        console.log("Edit drag model");
    };

    if (!profileProperties) {
        return (
            <CustomCard title={"Bullet"} expanded={expanded} />
        )
    }

    return (
        <CustomCard title={"Bullet"} expanded={expanded}>

            <TextInputChip 
                style={{ marginVertical: 4 }}
                icon={"card-bulleted-outline"} 
                label={"Bullet name"}
                text={profileProperties?.bulletName ?? "My bullet"}
                onTextChange={text => updateProfileProperties({ bulletName: text })}
            />

            <CaliberField />
            <BulletWeightField />
            <BulletLengthField />

            <View style={styles.row}>
                <Text style={[styles.column, { flex: 1 }, styles.label]}>
                    {"Drag model"}
                </Text>
                <Chip
                    icon={"function"}
                    closeIcon="square-edit-outline"
                    style={[styles.column, { flex: 2 }]}
                    textStyle={{ fontSize: 14 }}
                    onPress={editDragModel}
                    onClose={editDragModel}
                >
                    {"<PlaceHolder>"}
                    {/* {`0.318 G7`} */}
                </Chip>
            </View>
        </CustomCard>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        marginVertical: 4
    },
    column: {
        flexDirection: "column",
        alignSelf: "center",
        marginHorizontal: 4,
    },
    label: {
        fontSize: 14
    }
})

export default BulletCard;
