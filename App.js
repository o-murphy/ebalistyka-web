import React, { useEffect, useState } from 'react';
import { ProfileProvider } from './src/context/profileContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/context/themeContext';
import { PreferredUnitsProvider } from './src/context/preferredUnitsContext';
import MobileView from './src/screens/mobile/mobile';
import MainScreen from './src/screens/desktop/desktop';

import { Platform } from 'react-native';
import { DeviceType, getDeviceTypeAsync } from "expo-device";
import { AppSettingsProvider } from './src/context/settingsContext';
import { ConditionsProvider } from './src/context/currentConditions';


export default function App() {

  const [devType, setDevType] = useState(DeviceType.PHONE)

  useEffect(() => {
    getDeviceTypeAsync().then((deviceType) => {
      setDevType(deviceType);
    });
  }, []);
  console.log(DeviceType[devType], Platform.OS)
  return (
    <ThemeProvider>
      <PreferredUnitsProvider>
        <AppSettingsProvider>

          <ConditionsProvider>
            <ProfileProvider>

              <SafeAreaProvider>
                {devType === DeviceType.PHONE ? <MobileView /> : <MainScreen />}
              </SafeAreaProvider>

            </ProfileProvider>
          </ConditionsProvider>

        </AppSettingsProvider>
      </PreferredUnitsProvider>
    </ThemeProvider>
  );
}
