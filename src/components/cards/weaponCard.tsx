import { FAB, SegmentedButtons, Tooltip } from "react-native-paper";
import React, { useState, useEffect } from "react";
import CustomCard from "./customCard";
import { StyleSheet, View } from "react-native";
import { CalculationState, useCalculator } from "../../context/profileContext";
import { SightHeightField, TwistField, ZeroDistanceField, ZeroLookAngleField } from "../widgets/measureFields";
import { TextInputChip } from "../widgets/inputChip";
import { useTheme } from "../../context/themeContext";


interface WeaponCardProps {
    expanded?: boolean;
}

const WeaponCard: React.FC<WeaponCardProps> = ({ expanded = true }) => {
    const { profileProperties, updateProfileProperties, calcState, fire } = useCalculator();

    const { theme } = useTheme()
    const [refreshable, setRefreshable] = useState(false)

    useEffect(() => {
        if ([CalculationState.Complete].includes(calcState)) {
            setRefreshable(false)
        }
    }, [calcState]);

    const onTwistChange = (value) => {
        updateProfileProperties({ twistDir: value })
        setRefreshable(true)
    }

    if (!profileProperties) {
        return (
            <CustomCard title={"Weapon"} expanded={expanded} />
        );
    }

    return (
        <CustomCard title={"Weapon"} expanded={expanded}>

            <TextInputChip
                style={{ marginVertical: 4 }}
                icon={"card-bulleted-outline"}
                label={"Weapon name"}
                text={profileProperties?.profileName ?? "My rifle"}
                onTextChange={text => updateProfileProperties({ profileName: text })}
            />

            <SightHeightField />
            <TwistField />

            <View style={styles.row}>
                <SegmentedButtons
                    style={[styles.segment]}
                    buttons={twistStates}
                    value={profileProperties?.twistDir}
                    onValueChange={onTwistChange}
                />
                {
                    refreshable &&
                    <Tooltip title="Recalculate" enterTouchDelay={0} leaveTouchDelay={0} >
                    <FAB
                        visible={refreshable}
                        style={{ alignSelf: "center", 
                        // backgroundColor: theme.colors.onTertiary, 
                        marginVertical: 4, marginLeft: 4 }}
                        size={"small"}
                        icon={"reload"}
                        onPress={() => fire()}
                        // color={theme.colors.tertiary}
                        variant="tertiary"
                    />
                    </Tooltip>
                }
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
