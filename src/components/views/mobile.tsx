import React from 'react';
import { useTheme } from '../../context/themeContext';
import { PaperProvider } from 'react-native-paper';
import RootScreenManager from '../../screens/mobile/RootScreenManager';


const MobileView = () => {
    const { theme } = useTheme();
    
    return (
        <PaperProvider theme={theme}>
            <RootScreenManager />
        </PaperProvider>
    );
};


export default MobileView;
