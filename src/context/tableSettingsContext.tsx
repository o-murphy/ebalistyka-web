import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { ActivityIndicator } from 'react-native-paper';
import { DimensionProps, useDimension } from '../hooks/dimension';
import { Distance } from 'js-ballistics/dist/v2';
import { Unit } from 'js-ballistics';

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
};

interface TableSettingsContextType {
  tableSettings: TableSettings;
  setTableSettings: (settings: Partial<TableSettings>) => void;
  updateTableSettings: (settings: Partial<TableSettings>) => void;
  trajectoryStep: DimensionProps;
  trajectoryRange: DimensionProps;
}

export const TableSettingsContext = createContext<TableSettingsContextType | null>(null);

export const TableSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const trajectoryStep = useDimension({measure: Distance, defUnit: Unit.Meter, prefUnitFlag: 'distance', min: 0, max: 3000, precision: 1})
  const trajectoryRange = useDimension({measure: Distance, defUnit: Unit.Meter, prefUnitFlag: 'distance', min: 0, max: 3000, precision: 1})

  const [tableSettings, setTableSettings] = useState<TableSettings>(defaultSettings);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await loadUserData();
      setIsLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    saveTableSettings();
  }, [tableSettings, trajectoryStep, trajectoryRange]);

  const updateTableSettings = (props: Partial<TableSettings>) => {
    setTableSettings((prev) => ({ ...prev, ...props }));
  };

  const saveTableSettings = async () => {
    try {
      const jsonValue = JSON.stringify({
        ...tableSettings, 
        trajectoryStep: trajectoryStep.asDef,
        trajectoryRange: trajectoryRange.asDef,
      });
      await AsyncStorage.setItem('tableSettings', jsonValue);
    } catch (error) {
      console.error('Failed to save table settings:', error);
    }
  };

  const loadUserData = async () => {
    try {
      const settingsValue = await AsyncStorage.getItem('tableSettings');
      if (settingsValue) {
        const settingsParsed = JSON.parse(settingsValue)
        setTableSettings(settingsParsed);
        trajectoryStep.setAsDef(settingsParsed.trajectoryStep || 10)
        trajectoryRange.setAsDef(settingsParsed.trajectoryRange || 2000)
      }
    } catch (error) {
      console.error('Failed to load table settings:', error);
    }
  };

  if (isLoading) return <LoadingSpinner />; // Replace with an actual loading spinner

  return (
    <TableSettingsContext.Provider value={{ 
      tableSettings, 
      setTableSettings: updateTableSettings, 
      updateTableSettings, 
      trajectoryStep,
      trajectoryRange,
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

// Add a LoadingSpinner component or replace it with an actual spinner component
const LoadingSpinner = () => <ActivityIndicator />;