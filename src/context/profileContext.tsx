import React, { createContext, useState, useRef, useContext } from 'react';
import parseA7P from '../utils/parseA7P';

// Create the context
export const ProfileContext = createContext(null);

// Create a provider component
export const ProfileProvider = ({ children }) => {
  const [profileProperties, setProfileProperties] = useState(null);
  const [currentConditions, setCurrentConditions] = useState({
    temperature: 15,
    pressure: 1000,
    humidity: 50,
    windSpeed: 0,
    windDirection: 0,
  });

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

  const updateProfileProperties = (props) => {
    if (profileProperties) {
      console.log(props)
      setProfileProperties((prev) => ({
        ...prev,
        ...props,
      }));
    }
  };

  const updateCurrentConditions = (props) => {
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
    }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);

