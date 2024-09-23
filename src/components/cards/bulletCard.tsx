import { Text, TextInput, Chip, ActivityIndicator } from "react-native-paper";
import React, { useCallback, useContext, useEffect, useState } from "react";
import InputCard from "./inputCard";
import SimpleDialog from "../dialogs/simpleDialog";
import { Unit, UnitProps } from "js-ballistics/dist/v2";
import { View } from "react-native";
import MeasureFormField, { MeasureFormFieldProps, styles as measureFormFieldStyles } from "../widgets/measureField";
import { useProfile } from "../../context/profileContext";
import debounce from "../../utils/debounce";

interface BulletCardProps {
    expanded?: boolean;
}

const BulletCard: React.FC<BulletCardProps> = ({ expanded = true }) => {
    const { profileProperties, updateProfileProperties } = useProfile();
    const [curName, setCurName] = useState<string>("My Bullet");

    const debouncedUpdateProfileProperties = useCallback(debounce(updateProfileProperties, 300), [updateProfileProperties]);

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
            <InputCard title={"Bullet"} expanded={expanded}>
                {/* <ActivityIndicator animating={true} /> */}
            </InputCard>
        )
    }

    return (
        <InputCard title={"Bullet"} expanded={expanded}>
            <SimpleDialog
                style={measureFormFieldStyles.nameContainer}
                label={"Name"}
                icon={"card-bulleted-outline"}
                text={profileProperties?.bulletName}
                onAccept={acceptName}
                onDecline={declineName}
            >
                <TextInput
                    value={curName}
                    onChangeText={setCurName}
                />
            </SimpleDialog>

            <MeasureFormField
                {...fields.weight}
                value={profileProperties ? profileProperties.bWeight / 10 : 0}
                onValueChange={value => debouncedUpdateProfileProperties({ bWeight: Math.round(value * 10) })}
            />

            <MeasureFormField
                {...fields.length}
                value={profileProperties ? profileProperties.bLength / 10 : 0}
                onValueChange={value => debouncedUpdateProfileProperties({ bLength: Math.round(value * 10) })}
            />

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
                    {`0.318 G7`}
                </Chip>
            </View>
        </InputCard>
    );
};

const fields: Record<string, MeasureFormFieldProps> = {
    weight: {
        key: "weight",
        label: "Weight",
        suffix: UnitProps[Unit.Grain].symbol,
        icon: "weight",
        maxValue: 50,
        minValue: -50,
        fractionDigits: 1,
        value: 15,
    },
    length: {
        key: "length",
        label: "Length",
        suffix: UnitProps[Unit.Inch].symbol,
        icon: "arrow-expand-horizontal",
        maxValue: 5,
        minValue: 0,
        fractionDigits: 2,
        value: 1.7,
    },
};

export default BulletCard;
