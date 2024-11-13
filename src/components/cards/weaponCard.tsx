import { Chip, FAB, Icon, List, SegmentedButtons, Surface, Text } from "react-native-paper";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import CustomCard from "./customCard";
import { Pressable, StyleSheet, View } from "react-native";
import { CalculationState, useCalculator } from "../../context/profileContext";
import { SightHeightField, TwistField, ZeroDistanceField, ZeroLookAngleField } from "../widgets/measureFields";
import { TextInputChip } from "../widgets/inputChip";
import { RefreshFAB, RefreshFabState } from "../widgets/refreshFAB";
import { ValueDialog } from "../../screens/mobile/components";


interface WeaponCardProps {
    expanded?: boolean;
}

const WeaponName = () => {
    const { profileProperties, updateProfileProperties } = useCalculator();
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
    const { profileProperties, updateProfileProperties, calcState } = useCalculator();
    const [refreshable, setRefreshable] = useState(false)

    useEffect(() => {
        if (calcState === CalculationState.Complete) {
            setRefreshable(false)
        }
    }, [calcState]);

    const twist = useMemo(() => profileProperties?.twistDir, [profileProperties?.twistDir])

    const onTwistChange = useCallback((value: string): void => {
        updateProfileProperties({ twistDir: value })
        setRefreshable(true)
    }, [updateProfileProperties])

    return (
        <View style={styles.row}>
            <SegmentedButtons
                style={[styles.segment]}
                buttons={twistStates}
                value={twist}
                onValueChange={onTwistChange}
            />
            {
                refreshable && <RefreshFAB
                    state={refreshable ? RefreshFabState.Updated : RefreshFabState.Actual}
                    style={{ marginLeft: 4 }}
                />
            }
        </View>
    )
}


const PressableValue = ({ icon, value, title, onPress }) => {
    return (
        <Pressable onPress={onPress}>
            <Surface style={pressStyles.pressableView} elevation={0}>
                <Surface style={{ flex: 1 }} elevation={0}>
                    <Icon source={icon} size={24} />
                </Surface>
                <Text style={{ flex: 2 }}>{title}</Text>
                <Chip icon={"square-edit-outline"} textStyle={{ textAlign: "right" }} style={{ flex: 3 }} onPress={onPress}>{value}</Chip>
            </Surface>
        </Pressable>
    )
}

const pressStyles = StyleSheet.create({
    pressableView: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        marginVertical: 8,
    },
})

const ValueDialogChip = ({title, icon, dimension}) => {
    return (
        <ValueDialog
        label={title}
        icon={icon}
        enableSlider={false}
        dimension={dimension}
        button={<PressableValue icon={icon} title={title} value={`${dimension.asString} ${dimension.symbol}`} />}
    />
    )
}

const WeaponCard: React.FC<WeaponCardProps> = ({ expanded = true }) => {
    const { isLoaded, sightHeight, rTwist } = useCalculator()

    if (!isLoaded) {
        return <CustomCard title={"Weapon"} expanded={expanded} />
    }
    return (
        <CustomCard title={"Weapon"} expanded={expanded}>
            <WeaponName />

            <ValueDialogChip icon={"crosshairs"} title={"Sight height"} dimension={sightHeight}/>
            <ValueDialogChip icon={"screw-flat-top"} title={"Twist"} dimension={rTwist}/>


            {/* <SightHeightField /> */}
            {/* <TwistField /> */}
            {/* <TwistSwitch />
            <ZeroLookAngleField />
            <ZeroDistanceField /> */}
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
