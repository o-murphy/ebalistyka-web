import { Text, TextInput, Chip } from "react-native-paper";
import React, { useCallback, useEffect, useRef, useState } from "react";
import CustomCard from "./customCard";
import SimpleDialog from "../dialogs/simpleDialog";
import { View } from "react-native";
import { styles as measureFormFieldStyles } from "../widgets/measureFields/measureField/measureField";
import { CalculationState, useProfile } from "../../context/profileContext";
import debounce from "../../utils/debounce";
import { BulletLengthField, BulletWeightField, CaliberField } from "../widgets/measureFields";
import { ProfileProps } from "../../utils/parseA7P";
import RecalculateChip from "../widgets/recalculateChip";

interface BulletCardProps {
    expanded?: boolean;
}

const BulletCard: React.FC<BulletCardProps> = ({ expanded = true }) => {
    const { profileProperties, updateProfileProperties, calcState, autoRefresh } = useProfile();
    const [curName, setCurName] = useState<string>("My Bullet");

    const debouncedUpdateProfileProperties = useCallback(debounce(updateProfileProperties, 350), [updateProfileProperties]);

    const [refreshable, setRefreshable] = useState(false)

    const prevProfilePropertiesRef = useRef<ProfileProps | null>(null);

    useEffect(() => {

        if ([CalculationState.ZeroUpdated].includes(calcState) && !autoRefresh) {
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

    useEffect(() => {
        if (profileProperties) {
            setCurName(profileProperties.profileName);
        }
    }, [profileProperties]);

    const acceptName = (): void => debouncedUpdateProfileProperties({ bulletName: curName });
    const declineName = (): void => setCurName(profileProperties?.bulletName);

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

            <SimpleDialog
                style={measureFormFieldStyles.nameContainer}
                label={"Bullet name"}
                icon={"card-bulleted-outline"}
                text={profileProperties?.bulletName}
                onAccept={acceptName}
                onDecline={declineName}
            >
                <TextInput
                    value={curName}
                    onChangeText={setCurName}
                    maxLength={50}
                />
            </SimpleDialog>

            <CaliberField />
            <BulletWeightField />
            <BulletLengthField />

            <View style={measureFormFieldStyles.row}>
                <Text style={[measureFormFieldStyles.column, { flex: 1 }, measureFormFieldStyles.label]}>
                    {"Drag model"}
                </Text>
                <Chip
                    icon={"function"}
                    closeIcon="square-edit-outline"
                    style={[measureFormFieldStyles.column, { flex: 2 }]}
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

export default BulletCard;
