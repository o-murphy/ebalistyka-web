import React, {useEffect, useState} from 'react';
import { ProfileProvider } from './src/context/profileContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/context/themeContext';
import { PreferredUnitsProvider } from './src/context/preferredUnitsContext';
import MobileView from './src/components/views/mobile';
import MainScreen from './src/components/views/main';
import { DeviceType, getDeviceTypeAsync } from "expo-device";


export default function App() {

  const [devType, setDevType] = useState(DeviceType.PHONE)

  useEffect(() => {
    getDeviceTypeAsync().then((deviceType) => {
      setDevType(deviceType);
    });
  }, []);

  return (
    <ThemeProvider>
      <PreferredUnitsProvider>
        <ProfileProvider>
          <SafeAreaProvider >
            {devType === DeviceType.PHONE ? <MobileView /> : <MainScreen />}
          </SafeAreaProvider>
        </ProfileProvider>
      </PreferredUnitsProvider>
    </ThemeProvider>
  );
}
