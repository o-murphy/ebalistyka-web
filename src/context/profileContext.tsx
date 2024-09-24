import React, { createContext, useState, useRef, useContext, useEffect } from 'react';
import parseA7P, { ProfileProps } from '../utils/parseA7P';
import { CurrentConditions, makeShot, prepareCalculator, PreparedZeroData } from '../utils/ballisticsCalculator';
import { Atmo, Shot, UNew, HitResult} from 'js-ballistics/dist/v2';

interface ProfileContextType {
  profileProperties: ProfileProps | null;
  fetchBinaryFile: (file: string) => Promise<void>;
  setProfileProperties: React.Dispatch<React.SetStateAction<ProfileProps | null>>;
  updateProfileProperties: (props: Partial<ProfileProps>) => void;
  currentConditions: CurrentConditions;
  updateCurrentConditions: (props: Partial<CurrentConditions>) => void;
  calculator: PreparedZeroData | null;
  hitResult: HitResult | null;
}

// Create the context
export const ProfileContext = createContext<ProfileContextType | null>(null);

// Create a provider component
export const ProfileProvider = ({ children }) => {
  const [profileProperties, setProfileProperties] = useState<ProfileProps>(null);
  const [currentConditions, setCurrentConditions] = useState<CurrentConditions>({
    temperature: 15,
    pressure: 1000,
    humidity: 50,
    windSpeed: 0,
    windDirection: 0,
  });

  const [calculator, setCalculator] = useState<PreparedZeroData>(null)
  
  const [hitResult, setHitResult] = useState<HitResult>(null)

  useEffect(() => {
    if (profileProperties) {
      const preparedCalculator = prepareCalculator(profileProperties);
      setCalculator(preparedCalculator);
    }
  }, [profileProperties]);

  useEffect(() => {
    if (currentConditions && calculator) {
      const result = makeShot(calculator, currentConditions)
      setHitResult(result);
    }
  }, [currentConditions, calculator]); // Add dependencies here

  const fetchBinaryFile = async (EXAMPLE_A7P) => {
    try {
      const response = await fetch(EXAMPLE_A7P);
      const arrayBuffer = await response.arrayBuffer();

      parseA7P(arrayBuffer)
        .then(parsedData => {
          setProfileProperties(parsedData);
        })
        .catch(error => {
          console.error(error);
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
    }
  };

  const updateCurrentConditions = (props: Partial<CurrentConditions>) => {
    if (currentConditions) {
      setCurrentConditions((prev) => ({
        ...prev,
        ...props,
      }));
    }
  };

  // Provide both the file content and loading function to the context consumers
  return (
    <ProfileContext.Provider value={{
      profileProperties,
      fetchBinaryFile,
      setProfileProperties,
      updateProfileProperties,
      currentConditions,
      updateCurrentConditions,
      calculator,
      hitResult
    }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);

