import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Distance, Unit } from 'js-ballistics';
import { DimensionProps, useDimension } from '../hooks';

interface AppSettings {
    homeScreenDistanceStep: number;
}


// Define the context value type, including the setter function
export interface AppSettingsContextType {
    homeScreenDistanceStep: DimensionProps;
    saveAppSettings: () => void;
}

// Initialize the context with a null default value
export const AppSettingsContext = createContext<AppSettingsContextType | null>(null);

interface AppSettingsProviderProps {
    children: ReactNode;
}

const STORAGE_KEY = '@appSettings';

// Function to save appSettings to AsyncStorage
const saveAppSettingsToStorage = async (settings: AppSettings) => {
    try {
        const jsonValue = JSON.stringify(settings);
        await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (e) {
        console.error('Failed to save appSettings to AsyncStorage', e);
    }
};

// Function to load appSettings from AsyncStorage
const loadAppSettingsFromStorage = async (): Promise<AppSettings | null> => {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.error('Failed to load appSettings from AsyncStorage', e);
        return null;
    }
};

export const AppSettingsProvider: React.FC<AppSettingsProviderProps> = ({ children }) => {
    // const [appSettings, setAppSettings] = useState<AppSettings>(null);

    const homeScreenDistanceStep = useDimension({
        measure: Distance,
        defUnit: Unit.Meter,
        prefUnitFlag: "distance",
        min: 0,
        max: 3000,
        precision: 1,
    })

    const [isLoaded, setIsLoaded] = useState(false); // Track loading state

    useEffect(() => {
        const load = async () => {
            const storedUnits: AppSettings = await loadAppSettingsFromStorage();
            if (storedUnits) {
                homeScreenDistanceStep.setAsDef(storedUnits.homeScreenDistanceStep || 10)
            }
            console.log("Loading app settings")
            setIsLoaded(true); // Mark as loaded after attempting to load data
        };
        load();
    }, []);

    useEffect(() => {
        if (isLoaded) { // Only save if data has been loaded
            console.log("Saving app settings")
            saveAppSettings()
        }
    }, [homeScreenDistanceStep, isLoaded]);

    const saveAppSettings = () => {
        saveAppSettingsToStorage({
            homeScreenDistanceStep: homeScreenDistanceStep.asDef
        });
    }

    return (
        <AppSettingsContext.Provider value={{
            homeScreenDistanceStep,
            saveAppSettings
        }}>
            {children}
        </AppSettingsContext.Provider>
    );
};

export const useAppSettings = (): AppSettingsContextType => {
    const context = useContext(AppSettingsContext);
    if (!context) {
        throw new Error('useAppSettings must be used within a AppSettingsProvider');
    }
    return context;
};
