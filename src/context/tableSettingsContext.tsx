import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface TableSettings {
  trajectoryStep: number;
  trajectoryRange: number;
}

const defaultSettings: TableSettings = {
  trajectoryStep: 100,
  trajectoryRange: 2000
}


interface TableSettingsContextType {
  tableSettings: TableSettings;
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
  const [tableSettings, setTableSettings] = useState<TableSettings>(
    defaultSettings
  );

  useEffect(() => {
    loadUserData(); // Load data on mount
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