import React, { createContext, useContext, useState, useEffect } from 'react';
import protobuf from 'protobufjs';
import CryptoJS from 'crypto-js'; // Ensure you're using the correct import path for CryptoJS

// Create the context
export const ProfileLoaderContext = createContext(null);

export const MD5_LENGTH = 32;

// Create a provider component
export const ProfileLoaderProvider = ({ children }) => {
  const [fileContent, setFileContent] = useState(null);
  const [isChecksumValid, setIsChecksumValid] = useState(null);

  const fetchBinaryFile = async (EXAMPLE_A7P, PROTO_URL) => {
    try {
      const response = await fetch(EXAMPLE_A7P);
      const arrayBuffer = await response.arrayBuffer();
      const base64 = bufferToBase64(arrayBuffer);

      const binaryData = atob(base64);
      const md5Checksum = binaryData.slice(0, MD5_LENGTH);
      const actualData = binaryData.slice(MD5_LENGTH);

      const calculatedChecksum = md5(actualData);
      const isValid = md5Checksum === calculatedChecksum;

      setIsChecksumValid(isValid);

      const root = await protobuf.load(PROTO_URL);
      const Payload = root.lookupType('profedit.Payload');

      if (isValid) {
        try {
          const uint8ArrayData = new Uint8Array(actualData.split('').map(char => char.charCodeAt(0)));
          const payload = Payload.decode(uint8ArrayData);
          const payloadObject = Payload.toObject(payload, {
            longs: Number,
            enums: String,
            bytes: String,
            defaults: true,
            arrays: true
          });

          setFileContent(payloadObject.profile);
          console.log('Decoded payload:', payloadObject.profile);
        } catch (error) {
          console.error('Error decoding payload:', error);
        }
      } else {
        console.error('Checksum is invalid');
      }
    } catch (error) {
      console.error('Error fetching or processing binary file:', error);
    }
  };

  // Provide both the file content and loading function to the context consumers
  return (
    <ProfileLoaderContext.Provider value={{ fileContent, fetchBinaryFile, isChecksumValid }}>
      {children}
    </ProfileLoaderContext.Provider>
  );
};

// Utility function to convert array buffer to base64
const bufferToBase64 = (buffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

// Utility function to calculate MD5 checksum
const md5 = (data) => {
  // Convert binary string to WordArray for CryptoJS
  const wordArray = CryptoJS.enc.Latin1.parse(data);
  // Calculate MD5 hash and return as hexadecimal string
  const hash = CryptoJS.MD5(wordArray);
  return hash.toString(CryptoJS.enc.Hex);
};
