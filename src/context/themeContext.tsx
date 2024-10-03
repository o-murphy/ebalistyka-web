import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MD3LightTheme, MD3DarkTheme, MD3Theme } from 'react-native-paper';

// Define the shape of the context value
interface ThemeContextType {
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

// Create a provider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [nightMode, setNightMode] = useState<boolean>(true);
  const theme: MD3Theme = nightMode ? MD3DarkTheme : MD3LightTheme;

  const toggleNightMode = () => {
    setNightMode((prevNightMode) => !prevNightMode);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleNightMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the ThemeContext
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
