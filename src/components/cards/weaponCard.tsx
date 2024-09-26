import { SegmentedButtons, TextInput } from "react-native-paper";
import React, { useState, useEffect, useCallback } from "react";
import CustomCard from "./customCard";
import SimpleDialog from "../dialogs/simpleDialog";
import { Measure, preferredUnits, Unit } from "js-ballistics/dist/v2";
import { StyleSheet, View } from "react-native";
import MeasureFormField, { styles as measureFormFieldStyles } from "../widgets/measureField";
import { useProfile } from "../../context/profileContext";
import { UNew, UnitProps } from "js-ballistics";
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
    const debouncedUpdateProfileProperties = useCallback(debounce(updateProfileProperties, 350), [updateProfileProperties]);

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

    const OPTIONS = profileProperties.distances.map((value, index) => { return { label: UNew.Meter(value / 100).In(preferredUnits.distance).toFixed(0), value: index.toFixed(0) } })
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
                suffix={UnitProps[preferredUnits.diameter].symbol}
                value={profileProperties ? UNew.Inch(profileProperties.bDiameter / 1000).In(preferredUnits.diameter) : 0}
                onValueChange={value => debouncedUpdateProfileProperties({ bDiameter: Math.round(new Measure.Distance(value, preferredUnits.diameter).In(Unit.Inch) * 1000) })}
            />

            <MeasureFormField
                {...measureFieldsProps.sightHeight}
                suffix={UnitProps[preferredUnits.sight_height].symbol}
                value={profileProperties ? UNew.Millimeter(profileProperties.scHeight).In(preferredUnits.sight_height) : 0}
                onValueChange={value => debouncedUpdateProfileProperties({ scHeight: Math.round(new Measure.Distance(value, preferredUnits.sight_height).In(Unit.Millimeter)) })}
            />

            <MeasureFormField
                {...measureFieldsProps.twist}
                suffix={UnitProps[preferredUnits.twist].symbol}
                value={profileProperties ? UNew.Inch(profileProperties.rTwist / 100).In(preferredUnits.twist) : 0}
                onValueChange={value => debouncedUpdateProfileProperties({ rTwist: Math.round(new Measure.Distance(value, preferredUnits.twist).In(Unit.Inch) * 100) })}
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
                suffix={UnitProps[preferredUnits.angular].symbol}
                value={profileProperties ? UNew.Degree(profileProperties.cZeroWPitch / 10).In(preferredUnits.angular) : 0}
                onValueChange={value => debouncedUpdateProfileProperties({ cZeroWPitch: Math.round(new Measure.Angular(value, preferredUnits.angular).In(Unit.Degree) * 10) })}
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
