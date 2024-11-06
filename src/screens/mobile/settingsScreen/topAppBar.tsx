import React from "react";
import { Appbar, useTheme } from "react-native-paper";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";


// Top AppBar component
const SettingsScreenTopAppBar = ({ ...props }: NativeStackHeaderProps) => {
    const { back, navigation } = props;
    const theme = useTheme();

    return (
        <Appbar.Header
            mode="center-aligned"
            style={{
                height: 48,
                backgroundColor: theme.colors.elevation.level2,
            }}
        >
            <Appbar.BackAction onPress={() => navigation.navigate(back.title)} />
            <Appbar.Content title="Shot info" />
        </Appbar.Header>
    );
};


export default SettingsScreenTopAppBar;