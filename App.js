import React, { useEffect, useRef, useState } from 'react';
import { ProfileProvider } from './src/context/profileContext';
import { ThemeProvider } from './src/context/themeContext';
import { PreferredUnitsProvider } from './src/context/preferredUnitsContext';
import MobileView from './src/screens/mobile/mobile';
import MainScreen from './src/screens/desktop/desktop';

import { Platform } from 'react-native';
import { DeviceType } from "expo-device";
import { AppSettingsProvider } from './src/context/settingsContext';
import { ConditionsProvider } from './src/context/currentConditions';
import { TableSettingsProvider } from './src/context/tableSettingsContext';
import useDeviceType from './src/hooks/deviceType';
import { useWindowDimensions } from 'react-native';


const MOBILE_WIDTH = 500;


const AdaptiveView = () => {
  const deviceType = useDeviceType()
  const windowDimensions = useWindowDimensions()

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(windowDimensions?.width <= MOBILE_WIDTH)
  }, [windowDimensions])

  // console.log(DeviceType[deviceType], Platform.OS)

  if (deviceType === DeviceType.UNKNOWN) {
    return null
  }

  return isMobile ? <MobileView /> : <MainScreen />
}


export default function App() {



  return (
    <ThemeProvider>
      <PreferredUnitsProvider>
        <AppSettingsProvider>

          <ConditionsProvider>
            <ProfileProvider>
              <TableSettingsProvider>

                <AdaptiveView />

              </TableSettingsProvider>
            </ProfileProvider>
          </ConditionsProvider>

        </AppSettingsProvider>
      </PreferredUnitsProvider>
    </ThemeProvider>
  );
}
