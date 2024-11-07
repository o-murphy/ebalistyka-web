import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { BOTTOM_APP_BAR_HEIGHT } from "./botAppBar";
import { Surface, useTheme } from "react-native-paper";
import React from "react";


interface ScreenBackgroundProps {
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}


const ScreenBackground: React.FC<ScreenBackgroundProps> = ({ children = null, style = null }) => {

    const theme = useTheme()

    return (
        <Surface
            elevation={0}
            style={[styles.container, {backgroundColor: theme.colors.surface}, style]}
        >
            {children}
        </Surface>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: BOTTOM_APP_BAR_HEIGHT,
    },
})


export default ScreenBackground;