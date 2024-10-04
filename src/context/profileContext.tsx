import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import parseA7P, { ProfileProps } from '../utils/parseA7P';
import { CurrentConditionsProps, makeShot, prepareCalculator, PreparedZeroData, shootTheTarget, validateData } from '../utils/ballisticsCalculator';
import { HitResult } from 'js-ballistics/dist/v2';
import debounce from '../utils/debounce';

export enum CalculationState {
  Error = -1,
  NoData = 0,
  ZeroUpdated = 1,
  ConditionsUpdated = 2,
  Complete = 3,
  InvalidData = 4
}

interface CalculationContextType {
  profileProperties: ProfileProps | null;
  fetchBinaryFile: (file: string) => Promise<void>;
  setProfileProperties: React.Dispatch<React.SetStateAction<ProfileProps | null>>;
  updateProfileProperties: (props: Partial<ProfileProps>) => void;
  currentConditions: CurrentConditionsProps;
  updateCurrentConditions: (props: Partial<CurrentConditionsProps>) => void;
  calculator: PreparedZeroData | null;
  hitResult: HitResult | null | Error;
  adjustedResult: HitResult | null | Error;
  calcState: CalculationState;
  setCalcState: React.Dispatch<React.SetStateAction<CalculationState>>;
  // autoRefresh: boolean;
  // setAutoRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  zero: () => void;
  fire: () => Promise<void>;
  inProgress: boolean;
  trajectoryMode: TrajectoryMode,
  setTrajectoryMode: React.Dispatch<React.SetStateAction<TrajectoryMode>>,
  dataToDisplay: DataToDisplay,
  setDataToDisplay: React.Dispatch<React.SetStateAction<DataToDisplay>>,
  updMeasureErr: (props: {fkey: string, isError: boolean}) => void
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

export const CalculationContext = createContext<CalculationContextType | null>(null);

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profileProperties, setProfileProperties] = useState<ProfileProps | null>(null);
  const [currentConditions, setCurrentConditions] = useState<CurrentConditionsProps | null>({
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

  const [calcState, setCalcState] = useState<CalculationState>(CalculationState.NoData);
  // const [autoRefresh, setAutoRefresh] = useState<boolean>(false);
  const [calculator, setCalculator] = useState<PreparedZeroData | null>(null);
  const [hitResult, setHitResult] = useState<HitResult | Error | null>(null);
  const [adjustedResult, setAdjustedResult] = useState<HitResult | Error | null>(null);

  const [isLoaded, setIsLoaded] = useState(false); // Track loading state

  const [inProgress, setInProgress] = useState<boolean>(false)

  const [trajectoryMode, setTrajectoryMode] = useState<TrajectoryMode>(TrajectoryMode.Zero)
  const [dataToDisplay, setDataToDisplay] = useState<DataToDisplay>(DataToDisplay.Table);

  const [measureErr, setMeasureErr] = useState({})

  const updMeasureErr = ({ fkey, isError }) => {
    // console.log(fkey, isError)
    setMeasureErr((prev) => ({
      ...prev,
      ...{ [fkey]: isError },
    }));
  };

  useEffect(() => {
    loadUserData(); // Load data on mount
  }, []);

  useEffect(() => {
    if (isLoaded) { // Only save if data has been loaded
      saveProfileProperties(); // Save profile properties whenever it changes
    }
  }, [profileProperties, isLoaded]);

  useEffect(() => {
    if (isLoaded) { // Only save if data has been loaded
      saveCurrentConditions(); // Save current conditions whenever they change
    }
  }, [currentConditions, calculator, isLoaded]);

  const zero = () => {
    const preparedCalculator = prepareCalculator(profileProperties);
    setCalculator(preparedCalculator);
    return preparedCalculator;
  }

  const fire = async () => {
    const allFieldsValid = Object.values(measureErr).every(value => value === false);
    if (!allFieldsValid) {
      setCalcState(CalculationState.InvalidData)
      return
    }

    try {
      setInProgress(true);
      const currentCalc: PreparedZeroData = zero();
      if (currentCalc) {
        if (!currentCalc.error) {
          const result = makeShot(currentCalc, currentConditions);
          const adjustedResult = shootTheTarget(currentCalc, currentConditions);
          setHitResult(result);
          setAdjustedResult(adjustedResult);
          setCalcState(result instanceof Error ? CalculationState.Error : CalculationState.Complete);
        } else {
          setHitResult(currentCalc.error);
          setCalcState(CalculationState.Error);
        }
      }
    } catch (error) {
      console.error('Error during fire:', error);
      setCalcState(CalculationState.Error);
    } finally {
      setInProgress(false); // Set loading to false when the fire function ends
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
      setCalcState(CalculationState.ZeroUpdated);
    }
  };

  const updateCurrentConditions = (props: Partial<CurrentConditionsProps>) => {
    if (currentConditions) {
      setCurrentConditions((prev) => ({
        ...prev,
        ...props,
      }));
      setCalcState(CalculationState.ConditionsUpdated);
    }
  };

  const saveProfileProperties = async () => {
    try {
      const jsonValue = JSON.stringify(profileProperties);
      await AsyncStorage.setItem('profileProperties', jsonValue);
      // console.log("Saved profileProps", profileProperties);
    } catch (error) {
      // console.error('Failed to save profile properties:', error);
    }
  };

  const saveCurrentConditions = async () => {
    try {
      const jsonValue = JSON.stringify(currentConditions);
      await AsyncStorage.setItem('currentConditions', jsonValue);
      // console.log("Saved currentConditions", currentConditions);
    } catch (error) {
      // console.error('Failed to save current conditions:', error);
    }
  };

  const loadUserData = async () => {
    try {
      const profileValue = await AsyncStorage.getItem('profileProperties');
      const conditionsValue = await AsyncStorage.getItem('currentConditions');
      // console.log("Loaded profileProps", profileValue);
      // console.log("Loaded currentConditions", conditionsValue);

      if (profileValue !== null) {
        setProfileProperties(JSON.parse(profileValue));
      }

      if (conditionsValue !== null) {
        setCurrentConditions(JSON.parse(conditionsValue));
      }

      setIsLoaded(true); // Mark as loaded after attempting to load data
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const debouncedProfileUpdate = useCallback(debounce(updateProfileProperties, 350), [updateProfileProperties]);
  const debouncedUpdateConditions = useCallback(debounce(updateCurrentConditions, 350), [updateCurrentConditions]);

  return (
    <CalculationContext.Provider value={{
      profileProperties,
      fetchBinaryFile,
      setProfileProperties,
      updateProfileProperties: debouncedProfileUpdate,
      currentConditions,
      updateCurrentConditions: debouncedUpdateConditions,
      calculator,
      hitResult,
      adjustedResult,
      calcState,
      setCalcState,

      zero,
      fire,
      inProgress,

      trajectoryMode,
      setTrajectoryMode,

      dataToDisplay,
      setDataToDisplay,

      updMeasureErr,
    }}>
      {children}
    </CalculationContext.Provider>
  );
};

export const useCalculator = () => {
  const context = useContext(CalculationContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
