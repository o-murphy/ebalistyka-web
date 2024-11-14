import { Divider, SegmentedButtons } from "react-native-paper";
import React, { useMemo, useCallback } from "react";
import CustomCard from "./customCard";
import { StyleSheet } from "react-native";
import { useProfile } from "../../context/profileContext";
import { TextInputChip } from "../widgets/inputChip";
import { DimensionDialogChip } from "../../screens/desktop/components";


interface WeaponCardProps {
    expanded?: boolean;
}

const WeaponName = () => {
    const { profileProperties, updateProfileProperties } = useProfile();
    const text = useMemo(() => profileProperties?.cartridgeName, [profileProperties?.cartridgeName])
    return (
        <TextInputChip
            style={{ marginVertical: 4 }}
            icon={"card-bulleted-outline"}
            label={"Weapon name"}
            text={text ?? "My projectile"}
            onTextChange={text => updateProfileProperties({ profileName: text })}
        />
    )
}

const TwistSwitch = () => {
    const { profileProperties, updateProfileProperties } = useProfile();

    const twist = useMemo(() => profileProperties?.twistDir, [profileProperties?.twistDir])

    const onTwistChange = useCallback((value: string): void => {
        updateProfileProperties({ twistDir: value })
    }, [updateProfileProperties])

    return (
        <SegmentedButtons
            style={[styles.segment]}
            buttons={twistStates}
            value={twist}
            onValueChange={onTwistChange}
        />
    )
}




const WeaponCard: React.FC<WeaponCardProps> = ({ expanded = true }) => {
    const { isLoaded, scHeight, rTwist, cZeroWPitch, zeroDistance } = useProfile()

    if (!isLoaded) {
        return <CustomCard title={"Weapon"} expanded={expanded} />
    }
    return (
        <CustomCard title={"Weapon"} expanded={expanded}>
            <WeaponName />

            <DimensionDialogChip icon={"crosshairs"} title={"Sight height"} dimension={scHeight} />
            <Divider />
            <DimensionDialogChip icon={"screw-flat-top"} title={"Twist"} dimension={rTwist} />
            <TwistSwitch />
            <DimensionDialogChip icon={"angle-acute"} title={"Look angle"} dimension={cZeroWPitch} />
            <Divider />
            <DimensionDialogChip icon={"arrow-left-right"} title={"Zero distance"} dimension={zeroDistance} />

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
