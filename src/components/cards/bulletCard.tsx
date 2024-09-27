import { Text, TextInput, Chip } from "react-native-paper";
import React, { useCallback, useEffect, useState } from "react";
import CustomCard from "./customCard";
import SimpleDialog from "../dialogs/simpleDialog";
import { View } from "react-native";
import { styles as measureFormFieldStyles } from "../widgets/measureFields/measureField/measureField";
import { useProfile } from "../../context/profileContext";
import debounce from "../../utils/debounce";
import { BulletLengthField, BulletWeightField, CaliberField } from "../widgets/measureFields";

interface BulletCardProps {
    expanded?: boolean;
}

const BulletCard: React.FC<BulletCardProps> = ({ expanded = true }) => {
    const { profileProperties, updateProfileProperties } = useProfile();
    const [curName, setCurName] = useState<string>("My Bullet");

    const debouncedUpdateProfileProperties = useCallback(debounce(updateProfileProperties, 350), [updateProfileProperties]);

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
