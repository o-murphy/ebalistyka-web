import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootScreenManager from './RootScreenManager';
import { useThemeSwitch } from '../../context';


const MobileView = () => {
    const { theme } = useThemeSwitch();

    return (
        <SafeAreaProvider>
            <PaperProvider theme={theme}>
                <RootScreenManager />
            </PaperProvider>
        </SafeAreaProvider>
    );
};


export default MobileView;
