import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppSettings {
    homeScreenDistanceStep: number;
}

const defaultSettings: AppSettings = {
    homeScreenDistanceStep: 10
}

// Define the context value type, including the setter function
interface AppSettingsContextType {
    appSettings: AppSettings;
    setAppSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
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
    const [appSettings, setAppSettings] = useState<AppSettings>(defaultSettings);

    const [isLoaded, setIsLoaded] = useState(false); // Track loading state

    useEffect(() => {
        const loadUnits = async () => {
            const storedUnits = await loadAppSettingsFromStorage();
            if (storedUnits) {
                setAppSettings(storedUnits);
            }
            console.log("Loading app settings")
            setIsLoaded(true); // Mark as loaded after attempting to load data
        };
        loadUnits();
    }, []);

    useEffect(() => {
        if (isLoaded) { // Only save if data has been loaded
            console.log("Saving app settings")
            saveAppSettingsToStorage(appSettings);
        }
    }, [appSettings, isLoaded]);

    return (
        <AppSettingsContext.Provider value={{ appSettings, setAppSettings }}>
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
