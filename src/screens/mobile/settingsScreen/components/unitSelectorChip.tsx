import React, { useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { Chip, Dialog, Icon, Portal, RadioButton, Text, Surface } from "react-native-paper";
import { Unit, UnitProps } from "js-ballistics/dist/v2";


export interface UnitSelectorProps {
    label: string;
    value?: Unit;
    options: { label: string, value: Unit }[];
    onValueChange?: (value: Unit) => void;
    icon?: any
}


const UnitSelectorChip: React.FC<UnitSelectorProps> = ({ label, value, options, onValueChange, icon }) => {

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
        <Surface elevation={0}>
            <Pressable onPress={onPress}>
                <Surface style={styles.pressableView} elevation={0}>
                    <Surface style={{ flex: 1 }} elevation={0}>
                        <Icon source={icon} size={24}/>
                    </Surface>
                    <Text style={{ flex: 4 }}>{label}</Text>
                    <Chip
                        style={{ flex: 3 }}
                        onPress={onPress}
                        closeIcon={"square-edit-outline"}
                        onClose={onPress}
                    >
                        {UnitProps[value].name}
                    </Chip>
                </Surface>
            </Pressable>
            <Portal>
                <Dialog visible={dialogVisible} onDismiss={onDismiss} style={{maxWidth: 400, alignSelf: "center"}}>
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
        </Surface>
    )
}


const styles = StyleSheet.create({
    pressableView: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        marginVertical: 8,
        marginHorizontal: 16
    },
})


export default UnitSelectorChip;