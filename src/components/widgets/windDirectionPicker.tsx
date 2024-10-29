import {useTheme} from "react-native-paper";
import React from "react";
import {StyleProp, StyleSheet, View, ViewStyle} from "react-native";
import CircularSlider from "./circularSlider/web";


export default function WindDirectionPicker({value, onChange, style = null, diameter = 198}: {
    value: number, 
    onChange: (value: number) => void,
    style?: StyleProp<ViewStyle>,
    diameter?: number
}) {

    const theme = useTheme()

    const sliderProps = {
        coerceToInt: true,
        // capMode: "triangle",

        handleSize: diameter / 22,
        arcWidth: diameter / 11,
        strokeWidth: diameter / 11,
        meterTextSize: diameter / 11,

        handleColor: theme.colors.outline,
        arcColor: theme.colors.secondaryContainer,
        strokeColor: theme.colors.secondaryContainer,
        meterTextColor: theme.colors.outline,
    }

    const sliderValues = {
        minValue: 0,
        maxValue: 12,
        meterText: `${value * 30}° (${value}h)`
    }

    return (
        <View style={[style, styles.noSelect]}>
            <CircularSlider
                value={value}
                onChange={onChange}
                {...sliderProps}
                {...sliderValues}
                // style={styles.slider}
                dialDiameter={diameter}
                angleType={{
                    direction: "cw",
                    axis: "+y"
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    // container: {
    //     // flex: 1,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     paddingBottom: 40,
    // },
    text: {
        marginTop: -110,
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "center"
    },
    slider: {
        padding: 5
    },
    noSelect: {
        userSelect: 'none', // This will prevent text selection on web
    },
})