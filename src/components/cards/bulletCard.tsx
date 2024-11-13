import { Text, Chip, Divider } from "react-native-paper";
import React, { useMemo } from "react";
import CustomCard from "./customCard";
import { StyleSheet, View } from "react-native";
import { useCalculator } from "../../context/profileContext";
import { TextInputChip } from "../widgets/inputChip";
import { DimensionDialogChip } from "../../screens/desktop/components";

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
    const { isLoaded, bDiameter, bLength, bWeight } = useCalculator()

    if (!isLoaded) {
        return <CustomCard title={"Bullet"} expanded={expanded} />
    }
    return (
        <CustomCard title={"Bullet"} expanded={expanded}>
            <BulletName />
            <DimensionDialogChip icon={"diameter-variant"} title={"Bullet diameter"} dimension={bDiameter} />
            <Divider />
            <DimensionDialogChip icon={"ruler"} title={"Bullet length"} dimension={bLength} />
            <Divider />
            <DimensionDialogChip icon={"weight"} title={"Bullet weight"} dimension={bWeight} />
            <Divider />
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
