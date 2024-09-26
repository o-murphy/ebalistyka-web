import { Text, TextInput, Chip } from "react-native-paper";
import React, { useCallback, useEffect, useState } from "react";
import CustomCard from "./customCard";
import SimpleDialog from "../dialogs/simpleDialog";
import { View } from "react-native";
import MeasureFormField, { styles as measureFormFieldStyles } from "../widgets/measureField";
import { useProfile } from "../../context/profileContext";
import debounce from "../../utils/debounce";
import { measureFieldsProps } from "../widgets/measureFieldsProperties";
import { Measure, preferredUnits, UNew, UnitProps, Unit } from "js-ballistics/dist/v2";

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
            <CustomCard title={"Bullet"} expanded={expanded}>
                {/* <ActivityIndicator animating={true} /> */}
            </CustomCard>
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
                />
            </SimpleDialog>

            <MeasureFormField
                {...measureFieldsProps.weight}
                suffix={UnitProps[preferredUnits.weight].symbol}
                value={profileProperties ? UNew.Grain(profileProperties.bWeight / 10).In(preferredUnits.weight) : 0}
                onValueChange={value => debouncedUpdateProfileProperties({ bWeight: Math.round(new Measure.Weight(value, preferredUnits.weight).In(Unit.Grain) * 10) })}
            />

            <MeasureFormField
                {...measureFieldsProps.length}
                suffix={UnitProps[preferredUnits.length].symbol}
                value={profileProperties ? UNew.Inch(profileProperties.bLength / 1000).In(preferredUnits.length) : 0}
                onValueChange={value => debouncedUpdateProfileProperties({ bLength: Math.round(new Measure.Distance(value, preferredUnits.length).In(Unit.Inch) * 1000) })}

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
                    {"<PlaceHolder>"}
                    {/* {`0.318 G7`} */}
                </Chip>
            </View>
        </CustomCard>
    );
};

export default BulletCard;
