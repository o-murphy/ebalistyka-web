import React, { createContext, useState } from 'react';
import parseA7P from '../utils/parseA7P';

// Create the context
export const ProfileContext = createContext(null);


// Create a provider component
export const ProfileProvider = ({ children }) => {
  const [fileContent, setFileContent] = useState(null);

  const [currentConditions, setCurrentConditions] = useState({
    temperature: 15,
    pressure: 1000,
    humidity: 50
  })

  const fetchBinaryFile = async (EXAMPLE_A7P) => {
    try {
      const response = await fetch(EXAMPLE_A7P);
      const arrayBuffer = await response.arrayBuffer();

      parseA7P(arrayBuffer).then(parsedData => {
        setFileContent(parsedData);
      }).catch(error => {
        console.error(error)
      });

    } catch (error) {
      console.error('Error fetching or processing binary file:', error);
    }
  };

  const updateProfileProperties = (props: Object) => {
    if (fileContent) {
      setFileContent({
        ...fileContent,
        ...props,
      });
    }
  };

  const updateCurrentConditions = (props: Object) => {
    if (currentConditions) {
      setCurrentConditions({
        ...currentConditions,
        ...props,
      })
    }
  }

  // Provide both the file content and loading function to the context consumers
  return (
    <ProfileContext.Provider value={{
      fileContent,
      fetchBinaryFile,
      updateProfileProperties,
      currentConditions,
      updateCurrentConditions
    }}>
      {children}
    </ProfileContext.Provider>
  );
};

