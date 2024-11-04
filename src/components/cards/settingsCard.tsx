
import { Dialog, FAB, Portal } from "react-native-paper"

import { useEffect, useState } from "react";
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Dropdown } from "react-native-paper-dropdown";
import { Unit, UnitProps, Measure } from "js-ballistics/dist/v2"
import { usePreferredUnits } from "../../context/preferredUnitsContext";

export const getUnitList = (measure: Object) =>
    Object.keys(measure).map(
        (key: string): {
            label: string,
            value: Unit
        } => {
            return {
                label: UnitProps[measure[key]].name,
                value: measure[key]
            }
        }
    );


export interface UnitSelectorProps {
    fKey?: string;
    label: string;
    value?: Unit;
    defaultValue: Unit;
    options: { label: string, value: Unit }[];
    onValueChange?: (value: Unit) => void;
    containerStyle?: StyleProp<ViewStyle>;
    icon?: any
}

export const UnitSelector = ({ fKey: key = null, label, value = null, defaultValue, options, onValueChange, containerStyle, icon }: UnitSelectorProps) => {

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
    const {preferredUnits, setPreferredUnits} = usePreferredUnits()

    const [units, setUnits] = useState({
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
        setUnits(preferredUnits)
    }, [preferredUnits])

    const onUnitChange = (props: {}) => {
        setUnits({ ...units, ...props })
    }

    const onAccept = () => {
        setPreferredUnits({
            distance: units.distance,
            velocity: units.velocity,
            sizes: units.sizes,
            temperature: units.temperature,
            pressure: units.pressure,
            energy: units.energy,
            adjustment: units.adjustment,
            drop: units.drop,
            angular: units.angular,
            weight: units.weight,
        })

        setVisible(false)

    }

    const onDismiss = () => {
        setVisible(false)
    }

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
                <Dialog.Title>{"Settings"}</Dialog.Title>

                {/* <Dialog.Content> */}

                <Dialog.ScrollArea>
                      <ScrollView contentContainerStyle={{ padding: 24 }} showsVerticalScrollIndicator={false}>


                    {/* <View style={{ flex: 1, flexDirection: "column" }}> */}

                        <UnitSelector
                            containerStyle={styles.row}

                            fKey="distance"
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

                            fKey="velocity"
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

                            fKey="sizes"
                            label="Sizes units"
                            value={units.sizes}
                            defaultValue={units.sizes}
                            options={[
                                { label: UnitProps[Unit.Inch].name, value: Unit.Inch },
                                { label: UnitProps[Unit.Millimeter].name, value: Unit.Millimeter },
                                { label: UnitProps[Unit.Centimeter].name, value: Unit.Centimeter },
                                { label: UnitProps[Unit.Line].name, value: Unit.Line },
                            ]}
                            onValueChange={value => { onUnitChange({ sizes: value }) }}
                        />

                        <UnitSelector
                            containerStyle={styles.row}

                            fKey="angular"
                            label="Angular units"
                            value={units.angular}
                            defaultValue={units.angular}
                            options={getUnitList(Measure.Angular)}
                            onValueChange={value => { onUnitChange({ angular: value }) }}
                        />

                        <UnitSelector
                            containerStyle={styles.row}

                            fKey="adjustment"
                            label="Adjustment units"
                            value={units.adjustment}
                            defaultValue={units.adjustment}
                            options={getUnitList(Measure.Angular)}
                            onValueChange={value => { onUnitChange({ adjustment: value }) }}
                        />

                        <UnitSelector
                            containerStyle={styles.row}

                            fKey="drop"
                            label="Drop units"
                            value={units.drop}
                            defaultValue={units.drop}
                            options={getUnitList(Measure.Distance)}
                            onValueChange={value => { onUnitChange({ drop: value }) }}
                        />

                        <UnitSelector
                            containerStyle={styles.row}

                            fKey="weight"
                            label="Weight units"
                            value={units.weight}
                            defaultValue={units.weight}
                            options={getUnitList(Measure.Weight)}
                            onValueChange={value => { onUnitChange({ weight: value }) }}
                        />

                        <UnitSelector
                            containerStyle={styles.row}

                            fKey="temperature"
                            label="Temperature units"
                            value={units.temperature}
                            defaultValue={units.temperature}
                            options={getUnitList(Measure.Temperature)}
                            onValueChange={value => { onUnitChange({ temperature: value }) }}
                        />

                        <UnitSelector
                            containerStyle={styles.row}

                            fKey="pressure"
                            label="Pressure units"
                            value={preferredUnits.pressure}
                            defaultValue={preferredUnits.pressure}
                            options={getUnitList(Measure.Pressure)}
                            onValueChange={value => { onUnitChange({ pressure: value }) }}
                        />

                        <UnitSelector
                            containerStyle={styles.row}

                            fKey="energy"
                            label="Pressure units"
                            value={preferredUnits.energy}
                            defaultValue={preferredUnits.energy}
                            options={getUnitList(Measure.Energy)}
                            onValueChange={value => { onUnitChange({ energy: value }) }}
                        />

                    {/* </View> */}

                    {/* {children} */}
                      </ScrollView>
                  </Dialog.ScrollArea>

                {/* </Dialog.Content> */}

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

