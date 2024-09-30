import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import parseA7P, { ProfileProps } from '../utils/parseA7P';
import { CurrentConditions, makeShot, prepareCalculator, PreparedZeroData } from '../utils/ballisticsCalculator';
import { HitResult } from 'js-ballistics/dist/v2';

interface ProfileContextType {
  profileProperties: ProfileProps | null;
  fetchBinaryFile: (file: string) => Promise<void>;
  setProfileProperties: React.Dispatch<React.SetStateAction<ProfileProps | null>>;
  updateProfileProperties: (props: Partial<ProfileProps>) => void;
  currentConditions: CurrentConditions;
  updateCurrentConditions: (props: Partial<CurrentConditions>) => void;
  calculator: PreparedZeroData | null;
  hitResult: HitResult | null | Error;
  calcState: number;
  setCalcState: React.Dispatch<React.SetStateAction<number>>;
  autoRefresh: boolean;
  setAutoRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  fire: () => void;
}

export const ProfileContext = createContext<ProfileContextType | null>(null);

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const [profileProperties, setProfileProperties] = useState<ProfileProps | null>(null);
  const [currentConditions, setCurrentConditions] = useState<CurrentConditions>({
    temperature: 15,
    pressure: 1000,
    humidity: 50,
    windSpeed: 0,
    windDirection: 0,
    lookAngle: 0,
    targetDistance: 100,
    trajectoryStep: 100,
    trajectoryRange: 2000
  });

  const [calcState, setCalcState] = useState<number>(0);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [calculator, setCalculator] = useState<PreparedZeroData | null>(null);
  const [hitResult, setHitResult] = useState<HitResult | Error | null>(null);

  useEffect(() => {
    loadUserData(); // Load data on mount
  }, []);

  useEffect(() => {
    if (profileProperties) {
      const preparedCalculator = prepareCalculator(profileProperties);
      setCalculator(preparedCalculator);
      saveProfileProperties(); // Save profile properties whenever it changes
    }
  }, [profileProperties]);

  useEffect(() => {
    if (currentConditions && calculator && autoRefresh) {
      fire();
      saveCurrentConditions(); // Save current conditions whenever they change
    }
  }, [currentConditions, calculator, autoRefresh]);

  const fire = () => {
    if (calculator) {
      if (!calculator.error) {
        const result = makeShot(calculator, currentConditions);
        setHitResult(result);
        setCalcState(result instanceof Error ? -1 : 3);
      } else {
        setHitResult(calculator.error);
        setCalcState(-1);
      }
    }
  };

  const fetchBinaryFile = async (file: string) => {
    try {
      const response = await fetch(file);
      const arrayBuffer = await response.arrayBuffer();

      parseA7P(arrayBuffer)
        .then(parsedData => {
          setProfileProperties(parsedData);
        })
        .catch(error => {
          console.error('Error parsing A7P file:', error);
        });
    } catch (error) {
      console.error('Error fetching or processing binary file:', error);
    }
  };

  const updateProfileProperties = (props: Partial<ProfileProps>) => {
    if (profileProperties) {
      setProfileProperties((prev) => ({
        ...prev,
        ...props,
      }));
      setCalcState(1);
    }
  };

  const updateCurrentConditions = (props: Partial<CurrentConditions>) => {
    setCurrentConditions((prev) => ({
      ...prev,
      ...props,
    }));
    setCalcState(2);
  };

  const saveProfileProperties = async () => {
    try {
      const jsonValue = JSON.stringify(profileProperties);
      await AsyncStorage.setItem('profileProperties', jsonValue);
    } catch (error) {
      console.error('Failed to save profile properties:', error);
    }
  };

  const saveCurrentConditions = async () => {
    try {
      const jsonValue = JSON.stringify(currentConditions);
      await AsyncStorage.setItem('currentConditions', jsonValue);
    } catch (error) {
      console.error('Failed to save current conditions:', error);
    }
  };

  const loadUserData = async () => {
    try {
      const profileValue = await AsyncStorage.getItem('profileProperties');
      const conditionsValue = await AsyncStorage.getItem('currentConditions');

      if (profileValue !== null) {
        setProfileProperties(JSON.parse(profileValue));
      }

      if (conditionsValue !== null) {
        setCurrentConditions(JSON.parse(conditionsValue));
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  return (
    <ProfileContext.Provider value={{
      profileProperties,
      fetchBinaryFile,
      setProfileProperties,
      updateProfileProperties,
      currentConditions,
      updateCurrentConditions,
      calculator,
      hitResult,
      calcState,
      setCalcState,
      autoRefresh,
      setAutoRefresh,
      fire,
    }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
