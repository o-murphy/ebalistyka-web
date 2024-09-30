import React from 'react';
import { ProfileProvider } from './src/context/profileContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainScreen from './src/components/screens/main';
// import { isMobile } from 'react-device-detect';
import { ThemeProvider } from './src/context/themeContext';
import { PreferredUnitsProvider } from './src/context/preferredUnitsContext';


export default function App() {

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <PreferredUnitsProvider>
          <ProfileProvider>
            <MainScreen />
          </ProfileProvider>
        </PreferredUnitsProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
