import { Pressable, StyleSheet, View } from "react-native";
import { UnitSelectorProps } from "../../../../components/cards/settingsCard";
import { UnitProps } from "js-ballistics/dist/v2";
import React, { useState } from "react";
import { Chip, Dialog, Icon, Portal, RadioButton, Text } from "react-native-paper";


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
        <View>
            <Pressable onPress={onPress}>
                <View style={styles.pressableView}>
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