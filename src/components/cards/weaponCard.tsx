import { SegmentedButtons, TextInput } from "react-native-paper";
import React, { useState, useEffect, useCallback } from "react";
import CustomCard from "./customCard";
import SimpleDialog from "../dialogs/simpleDialog";
import { Unit } from "js-ballistics/dist/v2";
import { StyleSheet, View } from "react-native";
import MeasureFormField, { styles as measureFormFieldStyles } from "../widgets/measureField";
import { useProfile } from "../../context/profileContext";
import { UNew } from "js-ballistics";
import debounce from "../../utils/debounce";
import { Dropdown } from "react-native-paper-dropdown";
import { measureFieldsProps } from "../widgets/measureFieldsProperties";


interface WeaponCardProps {
    expanded?: boolean;
}

const WeaponCard: React.FC<WeaponCardProps> = ({ expanded = true }) => {
    const { profileProperties, updateProfileProperties } = useProfile();
    const [curName, setCurName] = useState<string>("My Rifle");

    // Use debounce for the profile name update to avoid excessive updates
    const debouncedUpdateProfileProperties = useCallback(debounce(updateProfileProperties, 300), [updateProfileProperties]);

    useEffect(() => {
        if (profileProperties) {
            setCurName(profileProperties.profileName);
        }
    }, [profileProperties]);

    const acceptName = (): void => debouncedUpdateProfileProperties({ profileName: curName });
    const declineName = (): void => setCurName(profileProperties?.profileName);

    if (!profileProperties) {
        return (
            <CustomCard title={"Weapon"} expanded={expanded}>
                {/* <ActivityIndicator animating={true} /> */}
            </CustomCard>
        );
    }

    const OPTIONS = profileProperties.distances.map((value, index) => { return { label: (value / 100).toFixed(0), value: index.toFixed(0) } })
    const VALUE = profileProperties.cZeroDistanceIdx.toFixed(0)

    return (
        <CustomCard title={"Weapon"} expanded={expanded}>

            <SimpleDialog
                style={measureFormFieldStyles.nameContainer}
                label={"Weapon name"}
                icon={"card-bulleted-outline"}
                text={profileProperties?.profileName}
                onAccept={acceptName}
                onDecline={declineName}
            >
                <TextInput
                    value={curName}
                    onChangeText={setCurName}
                />
            </SimpleDialog>

            {/* Other input fields */}
            {/* Debounce the update for each profile property change */}
            <MeasureFormField
                {...measureFieldsProps.caliber}
                value={profileProperties ? profileProperties.bDiameter / 1000 : 0}
                onValueChange={value => debouncedUpdateProfileProperties({ bDiameter: Math.round(value * 1000) })}
            />

            <MeasureFormField
                {...measureFieldsProps.sightHeight}
                value={profileProperties ? UNew.Millimeter(profileProperties.scHeight).In(Unit.Inch) : 0}
                onValueChange={value => debouncedUpdateProfileProperties({ scHeight: Math.round(UNew.Inch(value).In(Unit.Millimeter)) })}
            />

            <MeasureFormField
                {...measureFieldsProps.twist}
                value={profileProperties ? profileProperties.rTwist / 100 : 0}
                onValueChange={value => debouncedUpdateProfileProperties({ rTwist: Math.round(value * 100) })}
            />

            {/* Twist direction with immediate update */}
            <View style={{ ...measureFormFieldStyles.row }}>
                {/* <Text style={[measureFormFieldStyles.column, measureFormFieldStyles.label]}>{"Twist direction"}</Text> */}
                <SegmentedButtons
                    style={[measureFormFieldStyles.column, styles.segment]}
                    buttons={twistStates}
                    value={profileProperties?.twistDir}
                    onValueChange={value => debouncedUpdateProfileProperties({ twistDir: value })}
                />
            </View>

            <MeasureFormField
                {...measureFieldsProps.lookAngle}
                value={profileProperties ? profileProperties.cZeroWPitch / 10 : 0}
                onValueChange={value => debouncedUpdateProfileProperties({ cZeroWPitch: Math.round(value * 10) })}
            />

            <Dropdown
                label={"Zero distance"}
                mode={"outlined"}
                // TODO: FUture fix
                // dense={true}
                // left={<TextInput.Icon icon={"arrow-left-right-bold"} size={iconSize} style={inputSideStyles.icon} />}
                options={OPTIONS}
                value={VALUE}
                onSelect={value => debouncedUpdateProfileProperties({
                    cZeroDistanceIdx: (() => { console.log(OPTIONS, value); return parseFloat(value) })()
                })}
            />

        </CustomCard>
    );
};

export const inputStyles = StyleSheet.create({
    style: {
        height: 24,
    },
    contentStyle: {
        fontSize: 14,
        textAlign: "left",
    },
    outlineStyle: {},
    underlineStyle: {},
});

const styles = StyleSheet.create({
    segment: {
        flex: 2,
        justifyContent: "center",
    },
    buttons: {},
});

const twistStates = [
    {
        value: 'RIGHT',
        label: 'Right',
        icon: "rotate-right",
        showSelectedCheck: true,
        style: styles.buttons,
    },
    {
        value: 'LEFT',
        label: 'Left',
        icon: "rotate-left",
        showSelectedCheck: true,
        style: styles.buttons,
    },
];

export default WeaponCard;
