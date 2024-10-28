import React from 'react';
import { ProfileProvider } from './src/context/profileContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { isMobile } from 'react-device-detect';
import { ThemeProvider } from './src/context/themeContext';
import { PreferredUnitsProvider } from './src/context/preferredUnitsContext';
import MobileView from './src/components/views/mobile';
import MainScreen from './src/components/views/main';


export default function App() {
  console.log(isMobile)
  return (
    <ThemeProvider>
      <PreferredUnitsProvider>
        <ProfileProvider>
          <SafeAreaProvider style={{ flex: 1 }}>
            {isMobile ? <MobileView /> : <MainScreen />}
          </SafeAreaProvider>
        </ProfileProvider>
      </PreferredUnitsProvider>
    </ThemeProvider>
  );
}
