import { Text, SegmentedButtons, TextInput, ActivityIndicator } from "react-native-paper";
import React, { useState, useContext, useEffect, useCallback } from "react";
import InputCard from "./inputCard";
import SimpleDialog from "../dialogs/simpleDialog";
import { Unit, UnitProps } from "js-ballistics/dist/v2";
import { StyleSheet, View } from "react-native";
import MeasureFormField, { iconSize, inputSideStyles, MeasureFormFieldProps, styles as measureFormFieldStyles } from "../widgets/measureField";
import { useProfile } from "../../context/profileContext";
import { UNew } from "js-ballistics";
import debounce from "../../utils/debounce";
import { Dropdown, DropdownInput } from "react-native-paper-dropdown";
import { PaperSelect } from "react-native-paper-select";

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
            <InputCard title={"Weapon"} expanded={expanded}>
                {/* <ActivityIndicator animating={true} /> */}
            </InputCard>
        );
    }

    const OPTIONS = profileProperties.distances.map((value, index) => {return {label: (value / 100).toFixed(0), value: index.toFixed(0)} })
    const VALUE = profileProperties.cZeroDistanceIdx.toFixed(0)

    return (
        <InputCard title={"Weapon"} expanded={expanded}>

            <SimpleDialog
                style={measureFormFieldStyles.nameContainer}
                label={"Name"}
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
                {...fields.caliber}
                value={profileProperties ? profileProperties.bDiameter / 1000 : 0}
                onValueChange={value => debouncedUpdateProfileProperties({ bDiameter: Math.round(value * 1000) })}
            />

            <MeasureFormField
                {...fields.sightHeight}
                value={profileProperties ? UNew.Millimeter(profileProperties.scHeight).In(Unit.Inch) : 0}
                onValueChange={value => debouncedUpdateProfileProperties({ scHeight: Math.round(UNew.Inch(value).In(Unit.Millimeter)) })}
            />

            <MeasureFormField
                {...fields.twist}
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
                {...fields.lookAngle}
                value={profileProperties ? profileProperties.cZeroWPitch : 0}
                onValueChange={value => debouncedUpdateProfileProperties({ cZeroWPitch: value })}
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
                    cZeroDistanceIdx: (() => {console.log(OPTIONS, value); return parseFloat(value)})()
                })}
            />

        </InputCard>
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

const fields: Record<string, MeasureFormFieldProps> = {
    caliber: {
        key: "bDiameter",
        label: "Caliber",
        suffix: UnitProps[Unit.Inch].symbol,
        icon: "diameter-variant",
        maxValue: 22,
        minValue: 0.001,
        fractionDigits: 3,
        step: 0.001,
        value: 0,
    },
    sightHeight: {
        key: "scHeight",
        label: "Sight height",
        suffix: UnitProps[Unit.Inch].symbol,
        icon: "crosshairs",
        maxValue: 5,
        minValue: 0,
        fractionDigits: 1,
        value: 0,
    },
    twist: {
        key: "rTwist",
        label: "Twist",
        suffix: UnitProps[Unit.Inch].symbol,
        icon: "screw-flat-top",
        maxValue: 20,
        minValue: 0,
        fractionDigits: 2,
        value: 0,
    },
    lookAngle: {
        key: "cZeroWPitch",
        label: "Look angle",
        suffix: UnitProps[Unit.Degree].symbol,
        icon: "angle-acute",
        maxValue: 90,
        minValue: -90,
        fractionDigits: 1,
        value: 0,
    },
}


export default WeaponCard;
