import { Chip, Icon, Surface, Text } from "react-native-paper";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { ValueDialog } from "../../mobile/components"


const PressableValue = ({ icon, value, title, onPress = null }) => {
    return (
        <Pressable onPress={onPress} >
            <Surface style={styles.pressableView} elevation={0}>
                <Surface style={{ flex: 1 }} elevation={0}>
                    <Icon source={icon} size={24} />
                </Surface>
                <Text style={{ flex: 4, marginHorizontal: 8 }}>{title}</Text>
                <Chip closeIcon={"square-edit-outline"} textStyle={{ textAlign: "right" }} style={{ flex: 5 }} onPress={onPress} onClose={onPress}>{value}</Chip>
            </Surface>
        </Pressable>
    )
}


const ValueDialogDimensionChip = ({ title, icon, dimension }) => {
    return (
        <ValueDialog
            label={title}
            icon={icon}
            enableSlider={false}
            dimension={dimension}
            button={
                <PressableValue
                    icon={icon}
                    title={title}
                    value={`${dimension.asString} ${dimension.symbol}`}
                />
            }
        />
    )
}


const styles = StyleSheet.create({
    pressableView: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 8,
    },
})

export default ValueDialogDimensionChip;