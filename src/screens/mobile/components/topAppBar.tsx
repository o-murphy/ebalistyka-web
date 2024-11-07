import React from "react";
import { Appbar, useTheme } from "react-native-paper";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";


export const TOP_APP_BAR_HEIGHT = 48

// Top AppBar component
const TopAppBar = ({ children }) => {
    const theme = useTheme();

    return (
        <Appbar.Header
            mode="center-aligned"
            elevated={true}
            style={{
                elevation: 2, 
                height: TOP_APP_BAR_HEIGHT,
            }}
        >
            {children}
        </Appbar.Header>
    );
};


export default TopAppBar;