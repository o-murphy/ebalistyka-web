import React, { createContext, useState, useRef } from 'react';
import parseA7P from '../utils/parseA7P';

// Create the context
export const ProfileContext = createContext(null);

// Create a provider component
export const ProfileProvider = ({ children }) => {
  const [profileProperties, setProfileContent] = useState(null);
  const [currentConditions, setCurrentConditions] = useState({
    temperature: 15,
    pressure: 1000,
    humidity: 50,
    windSpeed: 0,
    windDirection: 0,
  });

  const debounceTimeoutRef = useRef(null); // Ref to hold the timeout

  const fetchBinaryFile = async (EXAMPLE_A7P) => {
    try {
      const response = await fetch(EXAMPLE_A7P);
      const arrayBuffer = await response.arrayBuffer();

      parseA7P(arrayBuffer)
        .then(parsedData => {
          setProfileContent(parsedData);
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
      // Clear any existing timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // Set a new timeout to update the state
      debounceTimeoutRef.current = setTimeout(() => {
        setProfileContent((prev) => ({
          ...prev,
          ...props,
        }));
      }, 1000); // Update after 1 second of stability
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

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Provide both the file content and loading function to the context consumers
  return (
    <ProfileContext.Provider value={{
      profileProperties,
      fetchBinaryFile,
      updateProfileProperties,
      currentConditions,
      updateCurrentConditions,
    }}>
      {children}
    </ProfileContext.Provider>
  );
};
