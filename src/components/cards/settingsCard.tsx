
import { Dialog, FAB, Portal, Switch, Text } from "react-native-paper"


import {
    preferredUnits,
    Unit,
    UnitProps,
    Measure
} from "js-ballistics/dist/v2"
import { useEffect, useState } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Dropdown } from "react-native-paper-dropdown";
import { useProfile } from "../../context/profileContext";

const get_unit_list = (measure: Object) =>
    Object.keys(measure).map((key: string): { label: string, value: Unit } => {
        return { label: UnitProps[measure[key]].name, value: measure[key] }
    })


interface UnitSelectorProps {
    key?: string;
    label: string;
    value?: Unit;
    defaultValue: Unit;
    options: { label: string, value: Unit }[];
    onValueChange?: (value: Unit) => void;
    containerStyle?: StyleProp<ViewStyle>
}

const UnitSelector = ({ key = null, label, value = null, defaultValue, options, onValueChange, containerStyle }: UnitSelectorProps) => {

    const [curValue, setCurValue] = useState(value ?? defaultValue);

    const onSelect = (value) => {
        setCurValue(value)
        onValueChange?.(value)
    }

    return (
        <View key={key} style={containerStyle}>
            <Dropdown
                label={label}
                mode={"outlined"}
                options={options}
                value={curValue}
                onSelect={onSelect}
            />
        </View>
    )
}


export default function SettingsUnitCard({ visibility }) {

    const [visible, setVisible] = visibility

    const { 
        fire, autoRefresh, setAutoRefresh, calculator
    } = useProfile()

    // Initialize curAutoRefresh based on the current autoRefresh value
    const [curAutoRefresh, setCurAutoRefresh] = useState(autoRefresh);

    useEffect(() => {
        // Sync curAutoRefresh when autoRefresh changes
        setCurAutoRefresh(autoRefresh);
    }, [autoRefresh, visibility]);

    const [units, setUnits] = useState({
        distance: preferredUnits.distance,
        velocity: preferredUnits.velocity,
        length: preferredUnits.length,
        temperature: preferredUnits.temperature,
        pressure: preferredUnits.pressure,
        energy: preferredUnits.energy,
        adjustment: preferredUnits.adjustment,
        angular: preferredUnits.angular,
        weight: preferredUnits.weight,
    })

    const onUnitChange = (props: {}) => {
        setUnits({ ...units, ...props })
    }

    const onAccept = () => {

        preferredUnits.distance = units.distance
        preferredUnits.velocity = units.velocity
        preferredUnits.temperature = units.temperature
        preferredUnits.pressure = units.pressure
        preferredUnits.energy = units.energy
        preferredUnits.adjustment = units.adjustment
        preferredUnits.angular = units.angular
        preferredUnits.weight = units.weight

        preferredUnits.length = units.length
        preferredUnits.diameter = units.length
        preferredUnits.sight_height = units.length
        preferredUnits.twist = units.length

        setAutoRefresh(curAutoRefresh)

        if (curAutoRefresh && calculator) {
            fire()
        }

        setVisible(false)

    }

    const onDismiss = () => {
        setVisible(false)
    }

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
                <Dialog.Title>{"Settings"}</Dialog.Title>

                <Dialog.Content>

                    <View style={{ flex: 1, flexDirection: "column" }}>


                        <View style={styles.row}>
                            <Text style={styles.column}> Auto refresh</Text>
                            <Switch  value={curAutoRefresh} onValueChange={() => setCurAutoRefresh((prev) => !prev)}/>

                        </View>

                        <UnitSelector
                            containerStyle={styles.row}

                            key="distance"
                            label="Distance units"
                            value={preferredUnits.distance}
                            defaultValue={preferredUnits.distance}
                            options={[
                                { label: UnitProps[Unit.Meter].name, value: Unit.Meter },
                                { label: UnitProps[Unit.Foot].name, value: Unit.Foot },
                                { label: UnitProps[Unit.Yard].name, value: Unit.Yard },
                            ]}
                            onValueChange={value => { onUnitChange({ distance: value }) }}
                        />

                        <UnitSelector
                            containerStyle={styles.row}

                            key="velocity"
                            label="Velocity units"
                            value={units.velocity}
                            defaultValue={units.velocity}
                            options={[
                                { label: UnitProps[Unit.MPS].name, value: Unit.MPS },
                                { label: UnitProps[Unit.FPS].name, value: Unit.FPS },
                            ]}
                            onValueChange={value => { onUnitChange({ velocity: value }) }}
                        />

                        <UnitSelector
                            containerStyle={styles.row}

                            key="sizes"
                            label="Sizes units"
                            value={preferredUnits.length}
                            defaultValue={preferredUnits.length}
                            options={[
                                { label: UnitProps[Unit.Inch].name, value: Unit.Inch },
                                { label: UnitProps[Unit.Millimeter].name, value: Unit.Millimeter },
                                { label: UnitProps[Unit.Centimeter].name, value: Unit.Centimeter },
                                { label: UnitProps[Unit.Centimeter].name, value: Unit.Line },
                            ]}
                            onValueChange={value => { onUnitChange({ length: value }) }}
                        />

                        <UnitSelector
                            containerStyle={styles.row}

                            key="angular"
                            label="Angular units"
                            value={units.angular}
                            defaultValue={units.angular}
                            options={get_unit_list(Measure.Angular)}
                            onValueChange={value => { onUnitChange({ angular: value }) }}
                        />

                        <UnitSelector
                            containerStyle={styles.row}

                            key="adjustment"
                            label="Adjustment units"
                            value={units.adjustment}
                            defaultValue={units.adjustment}
                            options={get_unit_list(Measure.Angular)}
                            onValueChange={value => { onUnitChange({ adjustment: value }) }}
                        />

                        <UnitSelector
                            containerStyle={styles.row}

                            key="weight"
                            label="Weight units"
                            value={units.weight}
                            defaultValue={units.weight}
                            options={get_unit_list(Measure.Weight)}
                            onValueChange={value => { onUnitChange({ weight: value }) }}
                        />

                        <UnitSelector
                            containerStyle={styles.row}

                            key="temperature"
                            label="Temperature units"
                            value={units.temperature}
                            defaultValue={units.temperature}
                            options={get_unit_list(Measure.Temperature)}
                            onValueChange={value => { onUnitChange({ temperature: value }) }}
                        />

                        <UnitSelector
                            containerStyle={styles.row}

                            key="pressure"
                            label="Pressure units"
                            value={preferredUnits.pressure}
                            defaultValue={preferredUnits.pressure}
                            options={get_unit_list(Measure.Pressure)}
                            onValueChange={value => { onUnitChange({ pressure: value }) }}
                        />

                        <UnitSelector
                            containerStyle={styles.row}

                            key="energy"
                            label="Pressure units"
                            value={preferredUnits.energy}
                            defaultValue={preferredUnits.energy}
                            options={get_unit_list(Measure.Energy)}
                            onValueChange={value => { onUnitChange({ energy: value }) }}
                        />

                    </View>

                </Dialog.Content>

                <Dialog.Actions>
                    <FAB
                        icon="close"
                        mode="flat"
                        size="small"
                        onPress={onDismiss}
                        variant="tertiary"
                    />
                    <FAB icon="check" mode="flat" size="small" onPress={onAccept} />
                </Dialog.Actions>
            </Dialog>
        </Portal>

    )

}

const styles = StyleSheet.create({
    dialog: { width: 350, alignSelf: 'center', justifyContent: 'center' },
    column: {
        flex: 1,
        flexDirection: "row",
        marginHorizontal: 8,
    },
    row: {
        flex: 1,
        flexDirection: "row",
        marginVertical: 4,
        justifyContent: "center",
    },
    doubleSpinBox: {
        // justifyContent: "center",
        flex: 1,
    },
    nameContainer: {
        flex: 1,
        // marginVertical: 4,
    },
    label: {
        // fontSize: 14,
    },
});

