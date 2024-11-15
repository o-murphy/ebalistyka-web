import { Chip, Icon, Surface, Text } from "react-native-paper";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { DimensionDialog, NumericDialog } from "./valueDialog";
import { DimensionProps, NumeralProps } from "../../hooks/dimension";


export interface DimensionDialogChipProps {
    title: string; 
    icon: string; 
    enableSlider?: boolean;
    dimension: DimensionProps
}

export interface NumericDialogChipProps {
    title: string; 
    icon: string; 
    enableSlider?: boolean;
    numeral: NumeralProps;
}


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


const DimensionDialogChip: React.FC<DimensionDialogChipProps> = ({ title, icon, dimension, enableSlider = false }) => {
    return (
        <DimensionDialog
            label={title}
            icon={icon}
            enableSlider={enableSlider}
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

const NumericDialogChip: React.FC<NumericDialogChipProps> = ({ title, icon, numeral, enableSlider = false}) => {
    return (
        <NumericDialog
            label={title}
            icon={icon}
            enableSlider={enableSlider}
            numeral={numeral}
            button={
                <PressableValue
                    icon={icon}
                    title={title}
                    value={`${numeral.value.toFixed(numeral.range.accuracy)} ${numeral.symbol}`}
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

export {
    DimensionDialogChip,
    NumericDialogChip,
};