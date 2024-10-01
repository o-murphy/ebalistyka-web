import { SegmentedButtons } from "react-native-paper";
import React, { useState, useEffect, useRef } from "react";
import CustomCard from "./customCard";
import { UNew } from "js-ballistics/dist/v2";
import { StyleSheet, View } from "react-native";
import { CalculationState, useProfile } from "../../context/profileContext";
import { Dropdown } from "react-native-paper-dropdown";
import { SightHeightField, TwistField, ZeroDistanceField, ZeroLookAngleField } from "../widgets/measureFields";
import { ProfileProps } from "../../utils/parseA7P";
import RecalculateChip from "../widgets/recalculateChip";
import { TextInputChip } from "../widgets/inputChip";
import { usePreferredUnits } from "../../context/preferredUnitsContext";


interface WeaponCardProps {
    expanded?: boolean;
}

const WeaponCard: React.FC<WeaponCardProps> = ({ expanded = true }) => {
    const { profileProperties, updateProfileProperties, calcState } = useProfile();

    const [refreshable, setRefreshable] = useState(false)

    const prevProfilePropertiesRef = useRef<ProfileProps | null>(null);

    useEffect(() => {

        if ([CalculationState.ZeroUpdated].includes(calcState)) {
            const sh = prevProfilePropertiesRef.current?.scHeight !== profileProperties.scHeight;
            const twist = prevProfilePropertiesRef.current?.rTwist !== profileProperties.rTwist;
            const twDir = prevProfilePropertiesRef.current?.twistDir !== profileProperties.twistDir;
            const look = prevProfilePropertiesRef.current?.cZeroWPitch !== profileProperties.cZeroWPitch;
            const zeroDistIdx = prevProfilePropertiesRef.current?.cZeroDistanceIdx !== profileProperties.cZeroDistanceIdx;
            
            if (sh || twist || twDir || look || zeroDistIdx) {
                setRefreshable(true)                
            } else {
                setRefreshable(false)    
            }
        } 
        setRefreshable(false)
        
        // Update the ref with the current profileProperties
        prevProfilePropertiesRef.current = profileProperties;
    }, [profileProperties, calcState]);

    if (!profileProperties) {
        return (
            <CustomCard title={"Weapon"} expanded={expanded} />
        );
    }

    return (
        <CustomCard title={"Weapon"} expanded={expanded}>
            <RecalculateChip visible={refreshable} style={{ marginVertical: 8 }} />

            <TextInputChip 
                icon={"card-bulleted-outline"} 
                label={"Weapon name"}
                text={profileProperties?.profileName ?? "My rifle"}
                onTextChange={text => updateProfileProperties({ profileName: text })}
            />s

            <SightHeightField />
            <TwistField />

            <View style={{ ...styles.row }}>
                <SegmentedButtons
                    style={[styles.segment]}
                    buttons={twistStates}
                    value={profileProperties?.twistDir}
                    onValueChange={value => updateProfileProperties({ twistDir: value })}
                />
            </View>

            <ZeroLookAngleField />
            <ZeroDistanceField />

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
        flex: 1,
        justifyContent: "center",
    },
    buttons: {},

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
