import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { getUnitList, UnitSelectorProps } from "../../../components/cards/settingsCard";
import { Angular, Distance, Energy, Pressure, Temperature, Unit, UnitProps, Weight } from "js-ballistics/dist/v2";
import React, { useEffect, useState } from "react";
import { usePreferredUnits } from "../../../context/preferredUnitsContext";
import { Appbar, Button, Chip, Dialog, Divider, Icon, List, Portal, RadioButton, Text, useTheme } from "react-native-paper";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";


export const SettingsScreenTopAppBar = ({ ...props }: NativeStackHeaderProps) => {

    const { back, navigation } = props;
    const theme = useTheme()

    return (
        <Appbar.Header mode={"center-aligned"} style={{
            height: 48,
            backgroundColor: theme.colors.elevation.level2
        }}>
            <Appbar.BackAction onPress={() => navigation.navigate(back.title)} />
            <Appbar.Content title="Shot info" />
        </Appbar.Header>
    )
}


export const UnitSelectorChip: React.FC<UnitSelectorProps> = ({ label, value, options, onValueChange, icon }) => {

    const [dialogVisible, setDialogVisible] = useState(false)

    const onPress = () => {
        setDialogVisible(true)
    }

    const onSelect = (value) => {
        onValueChange?.(value)
        setDialogVisible(false)
    }

    const onDismiss = () => {
        setDialogVisible(false)
    }

    return (
        <View>
            <Pressable onPress={onPress}>
                <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center", marginVertical: 8, marginHorizontal: 16 }}>
                    <View style={{ flex: 1 }}>
                        <Icon source={icon} size={24} />
                    </View>
                    <Text style={{ flex: 4 }}>{label}</Text>
                    <Chip
                        style={{ flex: 3 }}
                        onPress={onPress}
                        closeIcon={"square-edit-outline"}
                        onClose={onPress}
                    >
                        {UnitProps[value].name}
                    </Chip>
                </View>
            </Pressable>
            <Portal>
                <Dialog visible={dialogVisible} onDismiss={onDismiss}>
                    <Dialog.Content>
                        <RadioButton.Group onValueChange={onSelect} value={value}>
                            {options.map((item, index) => <RadioButton.Item
                                key={index}
                                label={item.label}
                                value={item.value}
                                status={value === item.value ? 'checked' : 'unchecked'}
                            />)}
                        </RadioButton.Group>
                    </Dialog.Content>
                </Dialog>
            </Portal>
        </View>
    )
}


export const SettingsScreen = ({ navigation = null }) => {
    const theme = useTheme()
    const { preferredUnits, setPreferredUnits } = usePreferredUnits()
    const [saveBtnVisible, setSaveBtnVisible] = useState(false)

    // const [prefUnitsExpanded, setPrefUnitsExpanded] = useState(true)

    const [localUnits, setLocalUnits] = useState({
        distance: preferredUnits.distance,
        velocity: preferredUnits.velocity,
        sizes: preferredUnits.sizes,
        temperature: preferredUnits.temperature,
        pressure: preferredUnits.pressure,
        energy: preferredUnits.energy,
        adjustment: preferredUnits.adjustment,
        drop: preferredUnits.drop,
        angular: preferredUnits.angular,
        weight: preferredUnits.weight,
    })

    useEffect(() => {
        setLocalUnits(preferredUnits)
    }, [preferredUnits])

    const onUnitChange = (props: {}) => {
        setLocalUnits({ ...localUnits, ...props })
        setSaveBtnVisible(true)
    }

    const onSaveBtnPress = () => {
        setPreferredUnits(localUnits)
        setSaveBtnVisible(false)
    }

    const _styles = StyleSheet.create({
        scrollView: {
            flex: 1,
            paddingBottom: 64,
            backgroundColor: theme.colors.background,
        },
        scrollViewContainer: {
            paddingBottom: 16,
            backgroundColor: theme.colors.elevation.level1,
            borderBottomRightRadius: 32, borderBottomLeftRadius: 32
        },
    });

    return (
        <View style={{
            flex: 1,
            paddingBottom: 32,
            backgroundColor: theme.colors.secondaryContainer
        }}>
            {saveBtnVisible && <Button
                mode="contained"
                icon={"content-save"}
                buttonColor={theme.colors.tertiary}
                textColor={theme.colors.onTertiary}
                onPress={onSaveBtnPress}
                style={{ margin: 16 }}
            >
                Save settings
            </Button>}
            <ScrollView
                style={_styles.scrollView}
                keyboardShouldPersistTaps="always"
                alwaysBounceVertical={false}
                showsVerticalScrollIndicator={true}
                contentContainerStyle={_styles.scrollViewContainer}
            >


                <List.Section title={"Preferred units"}            >
                    <View>
                        <UnitSelectorChip
                            containerStyle={styles.row}
                            icon="map-marker-distance"
                            fKey="distance"
                            label="Distance units"
                            value={localUnits.distance}
                            defaultValue={preferredUnits.distance}
                            options={[
                                { label: UnitProps[Unit.Meter].name, value: Unit.Meter },
                                { label: UnitProps[Unit.Foot].name, value: Unit.Foot },
                                { label: UnitProps[Unit.Yard].name, value: Unit.Yard },
                            ]}
                            onValueChange={value => { onUnitChange({ distance: value }) }}
                        />
                        <Divider />

                        <UnitSelectorChip
                            containerStyle={styles.row}
                            icon={"speedometer"}
                            fKey="velocity"
                            label="Velocity units"
                            value={localUnits.velocity}
                            defaultValue={localUnits.velocity}
                            options={[
                                { label: UnitProps[Unit.MPS].name, value: Unit.MPS },
                                { label: UnitProps[Unit.FPS].name, value: Unit.FPS },
                            ]}
                            onValueChange={value => { onUnitChange({ velocity: value }) }}
                        />
                        <Divider />

                        <UnitSelectorChip
                            containerStyle={styles.row}
                            icon={"ruler"}
                            fKey="sizes"
                            label="Sizes units"
                            value={localUnits.sizes}
                            defaultValue={localUnits.sizes}
                            options={[
                                { label: UnitProps[Unit.Inch].name, value: Unit.Inch },
                                { label: UnitProps[Unit.Millimeter].name, value: Unit.Millimeter },
                                { label: UnitProps[Unit.Centimeter].name, value: Unit.Centimeter },
                                { label: UnitProps[Unit.Line].name, value: Unit.Line },
                            ]}
                            onValueChange={value => { onUnitChange({ sizes: value }) }}
                        />
                        <Divider />

                        <UnitSelectorChip
                            containerStyle={styles.row}
                            icon={"angle-acute"}
                            fKey="angular"
                            label="Angular units"
                            value={localUnits.angular}
                            defaultValue={localUnits.angular}
                            options={getUnitList(Angular)}
                            onValueChange={value => { onUnitChange({ angular: value }) }}
                        />
                        <Divider />

                        <UnitSelectorChip
                            containerStyle={styles.row}
                            icon={"arrow-expand-vertical"}
                            fKey="adjustment"
                            label="Adjustment units"
                            value={localUnits.adjustment}
                            defaultValue={localUnits.adjustment}
                            options={getUnitList(Angular)}
                            onValueChange={value => { onUnitChange({ adjustment: value }) }}
                        />
                        <Divider />

                        <UnitSelectorChip
                            containerStyle={styles.row}
                            icon={"arrow-expand-down"}
                            fKey="drop"
                            label="Drop units"
                            value={localUnits.drop}
                            defaultValue={localUnits.drop}
                            options={getUnitList(Distance)}
                            onValueChange={value => { onUnitChange({ drop: value }) }}
                        />
                        <Divider />

                        <UnitSelectorChip
                            containerStyle={styles.row}
                            icon={"weight"}
                            fKey="weight"
                            label="Weight units"
                            value={localUnits.weight}
                            defaultValue={localUnits.weight}
                            options={getUnitList(Weight)}
                            onValueChange={value => { onUnitChange({ weight: value }) }}
                        />
                        <Divider />

                        <UnitSelectorChip
                            containerStyle={styles.row}
                            icon={"thermometer"}
                            fKey="temperature"
                            label="Temperature units"
                            value={localUnits.temperature}
                            defaultValue={localUnits.temperature}
                            options={getUnitList(Temperature)}
                            onValueChange={value => { onUnitChange({ temperature: value }) }}
                        />
                        <Divider />

                        <UnitSelectorChip
                            containerStyle={styles.row}
                            icon={"gauge"}
                            fKey="pressure"
                            label="Pressure units"
                            value={localUnits.pressure}
                            defaultValue={localUnits.pressure}
                            options={getUnitList(Pressure)}
                            onValueChange={value => { onUnitChange({ pressure: value }) }}
                        />
                        <Divider />

                        <UnitSelectorChip
                            containerStyle={styles.row}
                            icon={"lightning-bolt"}
                            fKey="energy"
                            label="Pressure units"
                            value={localUnits.energy}
                            defaultValue={localUnits.energy}
                            options={getUnitList(Energy)}
                            onValueChange={value => { onUnitChange({ energy: value }) }}
                        />
                    </View>
                </List.Section>

            </ScrollView>
        </View>

    )
}

const styles = StyleSheet.create({
    dialog: { width: 350, height: "80%", alignSelf: 'center', justifyContent: 'center' },
    column: {
        flex: 1,
        flexDirection: "row",
        marginHorizontal: 8,
    },
    row: {
        flex: 1,
        marginVertical: 4,
        justifyContent: "center",
    },
    doubleSpinBox: {
        flex: 1,
    },
    nameContainer: {
        flex: 1,
    },
    label: {
        // fontSize: 14,
    },
});
