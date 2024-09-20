import {useTheme} from "react-native-paper";
import React from "react";
import {StyleSheet, View} from "react-native";
import CircularSlider from "./circularSlider/web";


export default function WindDirectionPicker({value, onChange, style}) {

    const theme = useTheme()

    const sliderProps = {
        coerceToInt: true,
        // capMode: "triangle",

        handleSize: 8,
        arcWidth: 16,
        strokeWidth: 16,
        meterTextSize: 14,

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

    const sliderValueHandler = {
        value: value,
        onChange: onChange
    }

    return (
        <View style={style}>
            <CircularSlider
                {...sliderValueHandler}
                {...sliderProps}
                {...sliderValues}
                // style={styles.slider}
                dialDiameter={160}
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
})