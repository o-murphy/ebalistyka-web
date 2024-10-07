import { Text, Chip } from "react-native-paper";
import React, { useMemo } from "react";
import CustomCard from "./customCard";
import { StyleSheet, View } from "react-native";
import { CalculationState, useCalculator } from "../../context/profileContext";
import { BulletLengthField, BulletWeightField, CaliberField } from "../widgets/measureFields";
import { TextInputChip } from "../widgets/inputChip";

interface BulletCardProps {
    expanded?: boolean;
}

const BulletName = () => {
    const { profileProperties, updateProfileProperties } = useCalculator();
    const text = useMemo(() => profileProperties?.bulletName, [profileProperties?.bulletName])
    return (
        <TextInputChip
            style={{ marginVertical: 4 }}
            icon={"card-bulleted-outline"}
            label={"Bullet name"}
            text={text ?? "My bullet"}
            onTextChange={text => updateProfileProperties({ bulletName: text })}
        />
    )
}

const DragModelEdit = () => {
    const editDragModel = () => {
        // navigate("DragModelScreen")
        console.log("Edit drag model");
    };

    return (
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
        </Chip>
    </View>
    )
}

const BulletCard: React.FC<BulletCardProps> = ({ expanded = true }) => {
    const { isLoaded } = useCalculator()

    if (!isLoaded) {
        return <CustomCard title={"Weapon"} expanded={expanded} />
    }
    return (
        <CustomCard title={"Bullet"} expanded={expanded}>
            <BulletName />
            <CaliberField />
            <BulletWeightField />
            <BulletLengthField />
            <DragModelEdit />
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
