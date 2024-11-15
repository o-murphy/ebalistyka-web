import { useTheme } from "react-native-paper";
import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import CircularSlider from "./circularSlider/web";
import CircularSliderNative from "./circularSlider/circularSliderNative";
import { DeviceType } from "expo-device";
import useDeviceType from "../../hooks/deviceType";


interface WindDirectionPickerProps {
    value: number;
    onChange: (value: number) => void;
    style?: StyleProp<ViewStyle>;
    diameter?: number;
    props?: any
}


const degreesToTime = (angle) => {
    // Normalize the angle to be within 0-360 degrees
    angle = angle % 360;

    // Calculate hours and minutes
    const hours = Math.floor(angle / 30); // 30 degrees per hour
    const minutes = Math.round(((angle % 30) / 30) * 60); // Remaining degrees converted to minutes

    // Normalize hours in 12-hour format
    const normalizedHours = hours % 12;

    // const formattedHours = normalizedHours === 0 ? 12 : normalizedHours; // Convert 0 hours to 12
    const formattedHours = String(normalizedHours === 0 ? 12 : normalizedHours).padStart(2, '0'); // Convert 0 hours to 12 and pad with zero

    // Format minutes to be two digits
    const formattedMinutes = String(minutes).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}`;
}

const meterText = (value) => {
    return `${(value * 30).toFixed(0)}° (${degreesToTime(value * 30)})`
}


const WindDirectionPicker: React.FC<WindDirectionPickerProps> = ({ value, onChange, style = null, diameter = 198, ...props }) => {

    const theme = useTheme()

    const deviceType = useDeviceType()

    const sliderProps = {
        coerceToInt: false,

        handleSize: diameter / 22,
        arcWidth: diameter / 11,
        strokeWidth: diameter / 11,
        meterTextSize: diameter / 11,

        handleColor: theme.colors.onSecondaryContainer,
        arcColor: theme.colors.secondaryContainer,
        strokeColor: theme.colors.secondaryContainer,
        meterTextColor: theme.colors.onSecondaryContainer,
    }

    const sliderValues = {
        minValue: 0,
        maxValue: 12,
        meterText: meterText(value)
    }

    const sliderValueHandler = {
        value: value,
        onChange: (value) => {
            onChange(Math.round(value * 10) / 10)
        }
    }

    return (
        <View style={[style, styles.noSelect]} {...props} >
            {
                deviceType === DeviceType.PHONE
                    ?
                    <CircularSliderNative
                        {...sliderValueHandler}
                        {...sliderValues}
                        {...{ ...sliderProps, capMode: "triangle" }}
                        dialDiameter={diameter}
                        angleType={{
                            direction: "cw",
                            axis: "+y"
                        }}
                    />
                    :
                    <CircularSlider
                        {...sliderValueHandler}
                        {...sliderProps}
                        {...sliderValues}
                        style={styles.slider}
                        dialDiameter={diameter}
                        angleType={{
                            direction: "cw",
                            axis: "+y"
                        }}
                    />
            }
        </View>
    )
}

const styles = StyleSheet.create({
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

export default WindDirectionPicker;