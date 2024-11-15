import React, { useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { DeviceType } from "expo-device";
import {
  AppSettingsProvider,
  ProfileProvider,
  ThemeProvider,
  PreferredUnitsProvider,
  ConditionsProvider,
  TableSettingsProvider,
  CalculatorProvider,
} from './src/context';
import { useDeviceType } from './src/hooks';
import { MobileView, DesktopView } from './src/screens';


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

  return isMobile ? <MobileView /> : <DesktopView />
}


export default function App() {

  return (
    <ThemeProvider>
      <PreferredUnitsProvider>
        <AppSettingsProvider>
          <ConditionsProvider>
            <ProfileProvider>
              <CalculatorProvider>
                <TableSettingsProvider>
                  <AdaptiveView />
                </TableSettingsProvider>
              </CalculatorProvider>
            </ProfileProvider>
          </ConditionsProvider>
        </AppSettingsProvider>
      </PreferredUnitsProvider>
    </ThemeProvider>
  );
}
