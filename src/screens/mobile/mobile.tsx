import React from 'react';
import { PaperProvider } from 'react-native-paper';
import RootScreenManager from './RootScreenManager';
import { useThemeSwitch } from '../../context/themeContext';


const MobileView = () => {
    const {theme} = useThemeSwitch();
    
    return (
        <PaperProvider theme={theme}>
            <RootScreenManager />
        </PaperProvider>
    );
};


export default MobileView;
