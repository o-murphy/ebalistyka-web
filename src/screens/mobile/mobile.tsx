import React from 'react';
import { PaperProvider } from 'react-native-paper';
import RootScreenManager from './RootScreenManager';
import { useThemeSwitch } from '../../context';
import { SafeAreaProvider } from 'react-native-safe-area-context';


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
