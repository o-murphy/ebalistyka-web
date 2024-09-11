import React, { useState, useRef } from 'react';
import { View, StyleSheet, TextInput as NativeTextInput, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';

interface DoubleSpinBoxProps {
    value?: number;
    onValueChange?: (newValue: number) => void;
    fixedPoints?: number; // Number of decimal places
    min?: number; // Minimum value
    max?: number; // Maximum value
    step?: number;
}

const DoubleSpinBox: React.FC<DoubleSpinBoxProps> = ({
    value = 0,
    onValueChange,
    fixedPoints = 2, // Default to 3 decimal places
    min = 0, // Default min value
    max = 100, // Default max value
    step = 1,
}) => {
    const [currentValue, setCurrentValue] = useState<string>(value.toFixed(fixedPoints));
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<NativeTextInput>(null); // To hold reference to the TextInput

    // Handle digit input from keyboard
    const handleInputChange = (text: string) => {
        // Allow only numeric input and the minus sign at the beginning
        const sanitizedText = text.replace(/(?!^-)[^0-9]/g, '');

        if (sanitizedText === '') {
            setCurrentValue('0'.padEnd(fixedPoints + 1, '0')); // Reset to 0 with specified decimal places
            if (onValueChange) onValueChange(0);
            return;
        }
        // Ensure the value starts with '-' if negative
        const isNegative = sanitizedText.startsWith('-');

        // Format the value with the specified number of decimal places
        const parsedValue = parseInt(sanitizedText, 10);
        const newValue = (parsedValue / Math.pow(10, fixedPoints)).toFixed(fixedPoints);

        const numericValue = parseFloat(newValue) //* (isNegative ? -1 : 1);

        // Validation
        if (numericValue < min) {
            setError(`Value must be at least ${min}`);
        } else if (numericValue > max) {
            setError(`Value must be at most ${max}`);
        } else {
            setError(null);
        }

        setCurrentValue(isNegative && numericValue == 0 ? "-" + newValue : newValue);
        if (onValueChange) onValueChange(numericValue);
    };

    // Add input at the end of the text or handle backspace
    const processKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
        const key = e.nativeEvent.key;

        if (key === '-') {
            // Handle negative sign
            if (!currentValue.includes('-')) {
                // console.log(currentValue)
                handleInputChange('-' + currentValue);
            } else {
                handleInputChange(currentValue.slice(1))
            }
        } else if (!isNaN(Number(key))) {
            // Append new digit to the end
            const appendedText = currentValue.replace(/(?!^-)[^0-9]/g, '') + key.replace(/[^0-9]/g, '');
            handleInputChange(appendedText);
        } else if (key === 'Backspace') {
            // Remove last character or "-"
            if (parseFloat(currentValue) == 0) {
                handleInputChange("0");
            } else {
                handleInputChange(
                    currentValue.slice(0, -1)
                );
            }
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                // label="Diameter"
                mode="flat"
                keyboardType="numeric"
                value={currentValue} // Display the current value
                onKeyPress={processKeyPress} // Handle key press for input and backspace
                style={styles.input}
                render={(props) => (
                    <NativeTextInput
                        {...props}
                        ref={inputRef} // Bind the reference to the TextInput
                        onFocus={() => {
                            // Move cursor to the end when the input is focused
                            if (inputRef.current) {
                                inputRef.current.setNativeProps({
                                    selection: {
                                        start: currentValue.length,
                                        end: currentValue.length,
                                    },
                                });
                            }
                        }}
                    />
                )}
            />
            <HelperText type="error" visible={!!error}>
                {error}
            </HelperText>
            {/* {error && <HelperText type="error">{error}</HelperText>} */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        width: 150,
        textAlign: 'center',
        fontSize: 24,
    },
});

export default DoubleSpinBox;

// import React, { useState } from 'react';
// import { View, StyleSheet } from 'react-native';
// import { TextInput, Button, IconButton } from 'react-native-paper';

// interface DoubleSpinBoxProps {
//   minValue?: number;
//   maxValue?: number;
//   step?: number;
//   value?: number;
//   onValueChange?: (newValue: number) => void;
// }

// const DoubleSpinBox: React.FC<DoubleSpinBoxProps> = ({
//   minValue = 0,
//   maxValue = 100,
//   step = 0.1,
//   value = 0,
//   onValueChange,
// }) => {
//   const [currentValue, setCurrentValue] = useState<number>(value);

//   const handleIncrease = () => {
//     const newValue = Math.min(currentValue + step, maxValue);
//     setCurrentValue(newValue);
//     if (onValueChange) {
//       onValueChange(newValue);
//     }
//   };

//   const handleDecrease = () => {
//     const newValue = Math.max(currentValue - step, minValue);
//     setCurrentValue(newValue);
//     if (onValueChange) {
//       onValueChange(newValue);
//     }
//   };

//   const handleInputChange = (text: string) => {
//     const newValue = parseFloat(text) || 0;
//     if (newValue >= minValue && newValue <= maxValue) {
//       setCurrentValue(newValue);
//       if (onValueChange) {
//         onValueChange(newValue);
//       }
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <IconButton icon="minus" mode="contained" onPress={handleDecrease} />
//       <TextInput
//         mode="outlined"
//         keyboardType="numeric"
//         value={currentValue.toFixed(2)}
//         onChangeText={handleInputChange}
//         style={styles.input}
//       />
//       <IconButton icon="plus" mode="contained" onPress={handleIncrease} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   input: {
//     width: 100,
//     textAlign: 'center',
//   },
// });

// export default DoubleSpinBox;
