import React, { createContext, useState } from 'react';
import parseA7P from '../utils/parseA7P';

// Create the context
export const ProfileLoaderContext = createContext(null);


// Create a provider component
export const ProfileLoaderProvider = ({ children }) => {
  const [fileContent, setFileContent] = useState(null);

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
      setFileContent((prevContent) => ({
        ...prevContent,
        ...props,
      }));
    }
  };

  // Provide both the file content and loading function to the context consumers
  return (
    <ProfileLoaderContext.Provider value={{ fileContent, fetchBinaryFile, updateProfileProperties }}>
      {children}
    </ProfileLoaderContext.Provider>
  );
};

