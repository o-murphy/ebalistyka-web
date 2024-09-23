import React, { createContext, useContext, useState } from 'react';
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

// Create a ThemeContext
export const ThemeContext = createContext(null);

// Create a provider component
export const ThemeProvider = ({ children }) => {
  const [nightMode, setNightMode] = useState(true);
  const theme = nightMode ? MD3DarkTheme : MD3LightTheme;

  const toggleNightMode = () => {
    setNightMode((prevNightMode) => !prevNightMode);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleNightMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
