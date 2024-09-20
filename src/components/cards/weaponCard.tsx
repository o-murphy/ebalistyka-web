import { Text, SegmentedButtons, TextInput, useTheme } from "react-native-paper";
import React, { useState, useContext, useEffect } from "react";
import InputCard from "./inputCard";
import SimpleDialog from "../dialogs/simpleDialog";
import { Unit, UnitProps } from "js-ballistics/dist/v2";
import { StyleSheet, View } from "react-native";
import MeasureFormField, { MeasureFormFieldProps, styles as measureFormFieldStyles } from "../widgets/measureField";
import { ProfileLoaderContext } from "../../providers/profileLoaderProvider";

interface WeaponCardProps {
    expanded?: boolean;
}

const WeaponCard: React.FC<WeaponCardProps> = ({ expanded = true }) => {
    const theme = useTheme();

    const twistStates = [
        {
            value: 'RIGHT',
            label: 'Right',
            icon: "rotate-right",
            showSelectedCheck: true,
            checkedColor: theme.colors.primary,
            style: styles.buttons,
        },
        {
            value: 'LEFT',
            label: 'Left',
            icon: "rotate-left",
            showSelectedCheck: true,
            checkedColor: theme.colors.primary,
            style: styles.buttons,
        },
    ];

    const { fileContent, updateProfileProperties } = useContext(ProfileLoaderContext);

    const [curName, setCurName] = useState<string>("My Rifle");

    useEffect(() => {
        setCurName(fileContent?.profileName)
    }, [fileContent])

    const acceptName = (): void => {
        updateProfileProperties({ profileName: curName })
    };

    const declineName = (): void => {
        setCurName(fileContent?.profileName)
    };

    return (
        <InputCard title={"Weapon"} expanded={expanded}>
            <SimpleDialog
                style={measureFormFieldStyles.nameContainer}
                label={"Name"}
                icon={"card-bulleted-outline"}
                text={fileContent?.profileName}
                onAccept={acceptName}
                onDecline={declineName}
            >
                <TextInput
                    value={curName}
                    onChangeText={setCurName}
                />
            </SimpleDialog>

            {fields.map(field =>
                <MeasureFormField
                    key={field.key}
                    field={field}
                    onValueChange={value => updateProfileProperties({ [field.key]: (value * 1000).toFixed(0) })} // Corrected line
                />
            )}

            <View style={{ ...measureFormFieldStyles.row }}>
                <Text style={[measureFormFieldStyles.column, measureFormFieldStyles.label]}>{"Twist direction"}</Text>
                <SegmentedButtons
                    style={[measureFormFieldStyles.column, styles.segment]}
                    buttons={twistStates}
                    value={fileContent?.twistDir}
                    onValueChange={value => updateProfileProperties({ twistDir: value })}
                />
            </View>
        </InputCard>
    );
};

const styles = StyleSheet.create({
    segment: {
        flex: 2,
        justifyContent: "center",
    },
    buttons: {},
});

const fields: MeasureFormFieldProps[] = [
    {
        key: "bDiameter",
        label: "Caliber",
        suffix: UnitProps[Unit.Inch].symbol,
        icon: "diameter-variant",
        initialValue: 0.308,
        maxValue: 22,
        minValue: 0.001,
        decimals: 3,
        step: 0.001
    },
    {
        key: "sight_height",
        label: "Sight height",
        suffix: UnitProps[Unit.Inch].symbol,
        icon: "crosshairs",
        initialValue: 3,
        maxValue: 5,
        minValue: 0,
        decimals: 1,
    },
    {
        key: "twist",
        label: "Twist",
        suffix: UnitProps[Unit.Inch].symbol,
        icon: "screw-flat-top",
        initialValue: 11,
        maxValue: 20,
        minValue: 0,
        decimals: 2,
    },
];

export default WeaponCard;
