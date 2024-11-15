import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { MD3LightTheme, MD3DarkTheme, MD3Theme } from 'react-native-paper';

// Define the shape of the context value
export interface ThemeContextType {
  theme: MD3Theme;
  toggleNightMode: () => void;
}

// Create a ThemeContext with a default value of `null`
// We will type the context as ThemeContextType | null initially
export const ThemeContext = createContext<ThemeContextType | null>(null);

// Define props for the ThemeProvider component
interface ThemeProviderProps {
  children: ReactNode;
}

const saveNightMode = async (isNightMode) => {
  try {
    const jsonValue = JSON.stringify(isNightMode);
    await AsyncStorage.setItem('nightMode', jsonValue);
  } catch (error) {
    console.error('Failed to save theme settings:', error);
  }
};

const loadUserData = async (setNightMode) => {
  try {
    const settingsValue = await AsyncStorage.getItem('nightMode');
    if (settingsValue) {
      setNightMode(JSON.parse(settingsValue));
    }
  } catch (error) {
    setNightMode(true)
    console.error('Failed to load table settings:', error);
  }
};

// Create a provider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [nightMode, setNightMode] = useState<boolean>(true);
  const theme: MD3Theme = nightMode ? MD3DarkTheme : MD3LightTheme;

  const toggleNightMode = () => {
    setNightMode((prevNightMode) => !prevNightMode);
  };

  useEffect(() => {
    loadUserData(setNightMode)
  }, [])

  useEffect(() => {
    saveNightMode(nightMode)
  }, [nightMode])

  return (
    <ThemeContext.Provider value={{ theme, toggleNightMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the ThemeContext
export const useThemeSwitch = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
