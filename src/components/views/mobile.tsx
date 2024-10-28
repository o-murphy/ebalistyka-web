import React from 'react';
import { useTheme } from '../../context/themeContext';
import { PaperProvider } from 'react-native-paper';
import RootScreenManager from '../../screens/RootScreenManager';
import { StatusBar } from 'expo-status-bar';


const MobileView = () => {
    const { theme } = useTheme();
    
    return (
        <PaperProvider theme={theme}>
            <RootScreenManager />
        </PaperProvider>
    );
};


export default MobileView;
