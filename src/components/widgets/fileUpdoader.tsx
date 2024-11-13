import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import parseA7P, { ProfileProps } from '../../utils/parseA7P';
import { useCalculator } from '../../context/profileContext';

const allowedExtensions = ['.a7p'];

const FileUploadButton = () => {
    const [fileName, setFileName] = useState('Upload file');
    const [fileData, setFileData] = useState(null);
    const [error, setError] = useState(null);
    const theme = useTheme();
    const fileInputRef = useRef(null);

    const { profileProperties, setProfileProperties, updateProfileProperties, setIsLoaded } = useCalculator();

    const onSuccess = (data: ProfileProps) => {
    //   if (profileProperties) {
        updateProfileProperties(data)
    //   } else {
    //     setProfileProperties(data)
    //   }
      setIsLoaded(true); // Mark as loaded after attempting to load data
    }

    // Function to handle file selection
    const handleFileChange = (event) => {
        const file = event.target.files[0]; // Get the first file
        if (file) {
            // Ensure the file type is allowed
            const fileExtension = file.name.slice((file.name.lastIndexOf(".")) >= 0 ? file.name.lastIndexOf(".") : file.name.length).toLowerCase();
            
            console.log("Selected file extension:", fileExtension);
            if (allowedExtensions.includes(fileExtension)) {
                setFileName(file.name); // Update the filename state
                const reader = new FileReader();
                reader.onload = (e) => {
                    const arrayBuffer = e.target.result;
                    setFileData(arrayBuffer); // Store the ArrayBuffer for parsing
                };
                reader.onerror = () => {
                    setError('Failed to read file');
                };
                reader.readAsArrayBuffer(file); // Read the file as an ArrayBuffer
            } else {
                setError('Invalid file type, .a7p expected.');
                setFileName('Upload file'); // Reset the filename if invalid
            }
        }
    };

    useEffect(() => {
        if (fileData) {
            parseA7P(fileData)
                .then((parsedData) => {
                    setError(null);
                    setFileData(null); // Reset fileData after processing
                    if (onSuccess) {
                        onSuccess(parsedData);
                    }
                })
                .catch((error) => {
                    console.error('Parsing error:', error);
                    setError(error);
                    // Alert.alert('Error', 'Failed to parse the file. Please try again.');
                    setFileName('Upload file'); // Reset filename on error
                });
        }
    }, [fileData, onSuccess]);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const btnProps = {
        textColor: error && theme.colors.error,
        buttonColor: error && theme.colors.onError,
        style: [styles.btnStyle, error && {
            color: theme.colors.onError,
            borderColor: theme.colors.error,
        }]
    }

    return (
        <View style={styles.container}>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }} // Hide the default file input
                id="file-upload" // Give an ID to the input
                onChange={handleFileChange}
                accept={allowedExtensions.join(',')} // Restrict to specific file types
            />
            <Button
                icon={"file"}
                mode={'outlined'}
                onPress={handleButtonClick}
                {...btnProps}
            >
                {error ? error : fileName}
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        maxWidth: 300,
        overflow: "hidden",
    },
    btnStyle: {
        height: 32,
        justifyContent: "center",
        borderStyle: "dashed",
        borderWidth: 2,
    },
    btnContentStyle: {
        height: 32,
    },
});

export default FileUploadButton;
