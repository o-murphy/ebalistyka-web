import { createHashRouter } from 'react-router'
import { AppLayout } from './components/layout/AppLayout'
import {
  HomeScreen,
  WeatherScreen,
  TablesScreen,
  ConvertorScreen,
  ShotInfoScreen,
  SettingsScreen,
  ChartsScreen,
  ProfileScreen,
} from './screens/new'

export const router = createHashRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true,          element: <HomeScreen /> },
      { path: 'weather',      element: <WeatherScreen /> },
      { path: 'tables',       element: <TablesScreen /> },
      { path: 'convertor',    element: <ConvertorScreen /> },
      { path: 'shot-info',    element: <ShotInfoScreen /> },
      { path: 'settings',     element: <SettingsScreen /> },
      { path: 'charts',       element: <ChartsScreen /> },
      { path: 'profile',      element: <ProfileScreen /> },
    ],
  },
])
