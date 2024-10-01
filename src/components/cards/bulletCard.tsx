import { Text, Chip } from "react-native-paper";
import React, { useEffect, useRef, useState } from "react";
import CustomCard from "./customCard";
import { StyleSheet, View } from "react-native";
import { CalculationState, useProfile } from "../../context/profileContext";
import { BulletLengthField, BulletWeightField, CaliberField } from "../widgets/measureFields";
import { ProfileProps } from "../../utils/parseA7P";
import RecalculateChip from "../widgets/recalculateChip";
import { TextInputChip } from "../widgets/inputChip";

interface BulletCardProps {
    expanded?: boolean;
}

const BulletCard: React.FC<BulletCardProps> = ({ expanded = true }) => {
    const { profileProperties, updateProfileProperties, calcState } = useProfile();

    const [refreshable, setRefreshable] = useState(false)

    const prevProfilePropertiesRef = useRef<ProfileProps | null>(null);

    useEffect(() => {

        if ([CalculationState.ZeroUpdated].includes(calcState)) {
            const caliber = prevProfilePropertiesRef.current?.bDiameter !== profileProperties.bDiameter;
            const weight = prevProfilePropertiesRef.current?.bWeight !== profileProperties.bWeight;
            const length = prevProfilePropertiesRef.current?.bLength !== profileProperties.bLength;
            const bcType = prevProfilePropertiesRef.current?.bcType !== profileProperties.bcType;
            const coeffs = prevProfilePropertiesRef.current?.coefRows !== profileProperties.coefRows;
    
            if (caliber || weight || length || bcType || coeffs) {
                setRefreshable(true)
            } else {
                setRefreshable(false)
            }
    
        } else {
            setRefreshable(false)
        }

        // Update the ref with the current profileProperties
        prevProfilePropertiesRef.current = profileProperties;
    }, [profileProperties, calcState]);

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
            <RecalculateChip visible={refreshable} style={{ marginVertical: 8 }} />

            <TextInputChip 
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
