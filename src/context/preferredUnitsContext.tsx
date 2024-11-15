import { Unit } from 'js-ballistics/dist/v2';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the type for the preferred units state
interface PreferredUnits {
  distance: Unit;
  velocity: Unit;
  sizes: Unit;
  temperature: Unit;
  pressure: Unit;
  energy: Unit;
  adjustment: Unit;
  drop: Unit;
  angular: Unit;
  weight: Unit;
}

// Define the context value type, including the setter function
export interface PreferredUnitsContextType {
  preferredUnits: PreferredUnits;
  setPreferredUnits: React.Dispatch<React.SetStateAction<PreferredUnits>>;
}

// Initialize the context with a null default value
export const PreferredUnitsContext = createContext<PreferredUnitsContextType | null>(null);

interface PreferredUnitsProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = '@preferred_units';

// Function to save preferredUnits to AsyncStorage
const savePreferredUnitsToStorage = async (units: PreferredUnits) => {
  try {
    const jsonValue = JSON.stringify(units);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error('Failed to save preferred units to AsyncStorage', e);
  }
};

// Function to load preferredUnits from AsyncStorage
const loadPreferredUnitsFromStorage = async (): Promise<PreferredUnits | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Failed to load preferred units from AsyncStorage', e);
    return null;
  }
};

export const PreferredUnitsProvider: React.FC<PreferredUnitsProviderProps> = ({ children }) => {
  const [preferredUnits, setPreferredUnits] = useState<PreferredUnits>({
    distance: Unit.Yard,
    velocity: Unit.FPS,
    sizes: Unit.Inch,
    temperature: Unit.Fahrenheit,
    pressure: Unit.hPa,
    energy: Unit.FootPound,
    adjustment: Unit.MIL,
    drop: Unit.Inch,
    angular: Unit.Degree,
    weight: Unit.Grain,
  });

  const [isLoaded, setIsLoaded] = useState(false); // Track loading state

  // Load preferred units from AsyncStorage on component mount
  useEffect(() => {
    const loadUnits = async () => {
      const storedUnits = await loadPreferredUnitsFromStorage();
      if (storedUnits) {
        setPreferredUnits(storedUnits);
      }
      console.log("Loading units")
      setIsLoaded(true); // Mark as loaded after attempting to load data
    };
    loadUnits();
  }, []);

  // Store preferred units to AsyncStorage whenever they are updated
  useEffect(() => {
    if (isLoaded) { // Only save if data has been loaded
      console.log("Saving units")
      savePreferredUnitsToStorage(preferredUnits);
    }
  }, [preferredUnits, isLoaded]);

  return (
    <PreferredUnitsContext.Provider value={{ preferredUnits, setPreferredUnits }}>
      {children}
    </PreferredUnitsContext.Provider>
  );
};

export const usePreferredUnits = (): PreferredUnitsContextType => {
  const context = useContext(PreferredUnitsContext);
  if (!context) {
    throw new Error('usePreferredUnits must be used within a PreferredUnitsProvider');
  }
  return context;
};
