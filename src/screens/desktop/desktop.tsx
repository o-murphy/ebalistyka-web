import React from 'react';
import { PaperProvider } from "react-native-paper";
import { useThemeSwitch } from "../../context";
import RootScreenManager from "./RootScreenManager";


const DesktopView = () => {

    const { theme } = useThemeSwitch();

    return (
        <PaperProvider theme={theme}>
            <RootScreenManager />
        </PaperProvider>
    );
};

export default DesktopView;
