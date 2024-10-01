import { SegmentedButtons, Text, TextInput } from "react-native-paper";
import React, { useState, useEffect, useCallback, useRef } from "react";
import CustomCard from "./customCard";
import SimpleDialog from "../dialogs/simpleDialog";
import { preferredUnits, UNew } from "js-ballistics/dist/v2";
import { StyleSheet, View } from "react-native";
import { styles as measureFormFieldStyles } from "../widgets/measureFields/measureField/measureField";
import { CalculationState, useProfile } from "../../context/profileContext";
import debounce from "../../utils/debounce";
import { Dropdown } from "react-native-paper-dropdown";
import { SightHeightField, TwistField, ZeroLookAngleField } from "../widgets/measureFields";
import { ProfileProps } from "../../utils/parseA7P";
import RecalculateChip from "../widgets/recalculateChip";
import { TextInputChip } from "../widgets/inputChip";


interface WeaponCardProps {
    expanded?: boolean;
}

const WeaponCard: React.FC<WeaponCardProps> = ({ expanded = true }) => {
    const { profileProperties, debouncedProfileUpdate, calcState, autoRefresh } = useProfile();

    const [refreshable, setRefreshable] = useState(false)

    const prevProfilePropertiesRef = useRef<ProfileProps | null>(null);

    useEffect(() => {

        if ([CalculationState.ZeroUpdated].includes(calcState) && !autoRefresh) {
            const sh = prevProfilePropertiesRef.current?.scHeight !== profileProperties.scHeight;
            const twist = prevProfilePropertiesRef.current?.rTwist !== profileProperties.rTwist;
            const twDir = prevProfilePropertiesRef.current?.twistDir !== profileProperties.twistDir;
            const look = prevProfilePropertiesRef.current?.cZeroWPitch !== profileProperties.cZeroWPitch;
            const zeroD = prevProfilePropertiesRef.current?.cZeroDistanceIdx !== profileProperties.cZeroDistanceIdx;
    
            if (sh || twist || twDir || look || zeroD) {
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

    if (!profileProperties) {
        return (
            <CustomCard title={"Weapon"} expanded={expanded} />
        );
    }

    const OPTIONS = profileProperties.distances.map((value, index) => { return { label: UNew.Meter(value / 100).In(preferredUnits.distance).toFixed(0), value: index.toFixed(0) } })
    const VALUE = profileProperties.cZeroDistanceIdx.toFixed(0)

    return (
        <CustomCard title={"Weapon"} expanded={expanded}>
            <RecalculateChip visible={refreshable} style={{ marginVertical: 8 }} />

            <TextInputChip 
                icon={"card-bulleted-outline"} 
                label={"Weapon name"}
                text={profileProperties?.profileName ?? "My rifle"}
                onTextChange={text => debouncedProfileUpdate({ profileName: text })}
            />s

            <SightHeightField />
            <TwistField />

            <View style={{ ...styles.row }}>
                <SegmentedButtons
                    style={[styles.segment]}
                    buttons={twistStates}
                    value={profileProperties?.twistDir}
                    onValueChange={value => debouncedProfileUpdate({ twistDir: value })}
                />
            </View>

            <ZeroLookAngleField />

            <Dropdown
                label={"Zero distance"}
                mode={"outlined"}
                // TODO: Future fix
                // dense={true}
                // left={<TextInput.Icon icon={"arrow-left-right-bold"} size={iconSize} style={inputSideStyles.icon} />}
                options={OPTIONS}
                value={VALUE}
                onSelect={value => debouncedProfileUpdate({
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
