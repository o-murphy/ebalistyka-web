import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface TableSettings {
  trajectoryStep: number;
  trajectoryRange: number;

  displayZeros: boolean;

  displayTime: boolean;
  displayRange: boolean;
  displayVelocity: boolean;
  displayHeight: boolean;
  displayDrop: boolean;
  displayDropAdjustment: boolean;
  displayWindage: boolean;
  displayWindageAdjustment: boolean;
  displayMach: boolean;
  displayDrag: boolean;
  displayEnergy: boolean;
}

const defaultSettings: TableSettings = {
  trajectoryStep: 100,
  trajectoryRange: 2000,

  displayZeros: true,

  displayTime: true, 
  displayRange: true, 
  displayVelocity: true, 
  displayHeight: true, 
  displayDrop: true, 
  displayDropAdjustment: true, 
  displayWindage: true, 
  displayWindageAdjustment: true, 
  displayMach: true, 
  displayDrag: true, 
  displayEnergy: true, 
}


interface TableSettingsContextType {
  tableSettings: TableSettings | null;
  setTableSettings: (props: TableSettings) => void;
  updateTableSettings: (props: Partial<TableSettings>) => void;
}


export enum TrajectoryMode {
  Zero = 1,
  Adjusted = 2
}

export enum DataToDisplay {
  Table = 1,
  Chart = 2,
  Reticle = 3,
  DragModel = 4,
}

export const TableSettingsContext = createContext<TableSettingsContextType | null>(null);

export const TableSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tableSettings, setTableSettings] = useState<TableSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  useEffect(() => {
    const fetchData = async () => {
      await loadUserData();
      setIsLoading(false); // Set loading to false after data is loaded
    };

    fetchData(); // Call the async function
  }, []);

  useEffect(() => {
    if (tableSettings) { // Only save if data has been loaded
      saveTableSettings(); // Save current conditions whenever they change
    }
  }, [tableSettings]);

  const updateTableSettings = (props: Partial<TableSettings>) => {
    if (tableSettings) {
      setTableSettings((prev) => ({
        ...prev,
        ...props,
      }));
    }
  };

  const saveTableSettings = async () => {
    try {
      const jsonValue = JSON.stringify(tableSettings);
      await AsyncStorage.setItem('tableSettings', jsonValue);
    } catch (error) {
      console.error('Failed to save table settings:', error);
    }
  };

  const loadUserData = async () => {
    try {

      const settingsValue = await AsyncStorage.getItem('tableSettings');

      if (settingsValue !== null && settingsValue !== 'null') {
        setTableSettings(JSON.parse(settingsValue));
      } else {
        console.log("Loading defaults")
        setTableSettings(defaultSettings)
      }

    } catch (error) {
      console.error('Failed to load table settings:', error);
    }
  };

  // Wait until data is loaded before rendering children
  if (isLoading) return null; // or a loading spinner component

  return (
    <TableSettingsContext.Provider value={{
      tableSettings,
      setTableSettings,
      updateTableSettings,
    }}>
      {children}
    </TableSettingsContext.Provider>
  );
};

export const useTableSettings = () => {
  const context = useContext(TableSettingsContext);
  if (!context) {
    throw new Error('useTableSettings must be used within a TableSettingsProvider');
  }
  return context;
};