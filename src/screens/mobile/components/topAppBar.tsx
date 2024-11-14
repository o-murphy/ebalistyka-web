import React from "react";
import { Appbar } from "react-native-paper";


export const TOP_APP_BAR_HEIGHT = 48

const TopAppBar = ({ children }) => {

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