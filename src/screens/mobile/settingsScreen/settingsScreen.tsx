import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useTheme, Banner, Divider, List, Text } from "react-native-paper";
import { usePreferredUnits } from "../../../context/preferredUnitsContext";
import { Angular, Energy, Pressure, Temperature, Unit, UnitProps, Weight } from "js-ballistics/dist/v2";
import { UnitSelectorChip } from "./components";

interface UnitConfig {
    icon: string;
    fKey: string;
    label: string;
    unitList: Unit[];
}


export const getUnitList = (measure: Object): Unit[] =>
    Object.keys(measure).map(
        (key: string): Unit => measure[key]
    );


const SettingsScreen = () => {
    const theme = useTheme();
    const { preferredUnits, setPreferredUnits } = usePreferredUnits();
    const [saveBtnVisible, setSaveBtnVisible] = useState(false);

    const [localUnits, setLocalUnits] = useState(preferredUnits);

    useEffect(() => {
        setLocalUnits(preferredUnits);
    }, [preferredUnits]);

    const handleUnitChange = (updatedUnit: Partial<typeof preferredUnits>) => {
        setLocalUnits((prev) => ({ ...prev, ...updatedUnit }));
        setSaveBtnVisible(true);
    };

    const handleSave = () => {
        setPreferredUnits(localUnits);
        setSaveBtnVisible(false);
    };

    const handleDiscard = () => {
        setLocalUnits(preferredUnits);
        setSaveBtnVisible(false);
    };

    return (
        <View style={[styles.container]}>
            <Banner
                visible={saveBtnVisible}
                style={{ backgroundColor: theme.colors.secondaryContainer }}
                actions={[
                    { label: "Save".toUpperCase(), onPress: handleSave, textColor: theme.colors.onSecondaryContainer },
                    { label: "Discard".toUpperCase(), onPress: handleDiscard, textColor: theme.colors.tertiary },
                ]}
                icon="content-save"
            >
                <Text>{"Changes detected in settings. Save changes?"}</Text>
            </Banner>

            <ScrollView
                style={[styles.scrollView, { backgroundColor: theme.colors.surface }]}
                contentContainerStyle={[styles.scrollViewContent, { backgroundColor: theme.colors.elevation.level1 }]}
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator
                alwaysBounceVertical={false}
            >
                <List.Section title="Preferred units">
                    {renderUnitSelectors(localUnits, handleUnitChange)}
                </List.Section>
            </ScrollView>
        </View>
    );
};

const renderUnitSelectors = (localUnits, handleUnitChange: (unit) => void) => {
    const unitsConfig: UnitConfig[] = [
        { icon: "map-marker-distance", fKey: "distance", label: "Distance units", unitList: [Unit.Meter, Unit.Foot, Unit.Yard] },
        { icon: "speedometer", fKey: "velocity", label: "Velocity units", unitList: [Unit.MPS, Unit.FPS] },
        { icon: "ruler", fKey: "sizes", label: "Sizes units", unitList: [Unit.Inch, Unit.Millimeter, Unit.Centimeter, Unit.Line] },
        { icon: "angle-acute", fKey: "angular", label: "Angular units", unitList: getUnitList(Angular) },
        { icon: "arrow-expand-vertical", fKey: "adjustment", label: "Adjustment units", unitList: getUnitList(Angular) },
        { icon: "arrow-expand-down", fKey: "drop", label: "Drop units", unitList: [Unit.Inch, Unit.Millimeter, Unit.Centimeter, Unit.Line, Unit.Meter, Unit.Yard] },
        { icon: "weight", fKey: "weight", label: "Weight units", unitList: getUnitList(Weight) },
        { icon: "thermometer", fKey: "temperature", label: "Temperature units", unitList: getUnitList(Temperature) },
        { icon: "gauge", fKey: "pressure", label: "Pressure units", unitList: getUnitList(Pressure) },
        { icon: "lightning-bolt", fKey: "energy", label: "Energy units", unitList: getUnitList(Energy) },
    ];

    const isChanged = (unit: UnitConfig, newValue: Unit) => {
        return localUnits[unit.fKey] !== newValue;
    };

    const handleChange = (unit: UnitConfig, value: Unit) => {
        return isChanged(unit, value) && handleUnitChange({ [unit.fKey]: value });
    };

    return unitsConfig.map((unit, index) => (
        <View key={unit.fKey}>
            <UnitSelectorChip
                containerStyle={styles.unitRow}
                icon={unit.icon}
                fKey={unit.fKey}
                label={unit.label}
                value={localUnits[unit.fKey]}
                options={unit.unitList
                    .map((value) => {
                        const unitProps = UnitProps[value];
                        return unitProps ? { label: unitProps.name, value } : null;
                    })
                    .filter((option) => option !== null)} // filter out any null values
                onValueChange={(value) => handleChange(unit, value)}
            />
            {index < unitsConfig.length - 1 && <Divider />}
        </View>
    ));
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 32,
    },
    scrollView: {
        flex: 1,
        paddingBottom: 64,
    },
    scrollViewContent: {
        paddingBottom: 16,
        borderBottomRightRadius: 32,
        borderBottomLeftRadius: 32,
    },
    unitRow: {
        flex: 1,
        marginVertical: 4,
        justifyContent: "center",
    },
});

export default SettingsScreen;