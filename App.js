import React from 'react';
import { ProfileProvider } from './src/context/profileContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainScreen from './src/components/screens/main';
// import { isMobile } from 'react-device-detect';
import { ThemeProvider } from './src/context/themeContext';


export default function App() {

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ProfileProvider>
          <MainScreen />
        </ProfileProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
