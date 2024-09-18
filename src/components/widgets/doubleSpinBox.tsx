import React, { useState, useRef } from 'react';
import { View, NativeSyntheticEvent, TextInputKeyPressEventData, TextInputScrollEventData } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';
import {Props as TextInputProps} from "react-native-paper/src/components/TextInput/TextInput"
import { StyleProp, ViewStyle } from 'react-native';

interface DoubleSpinBoxProps {
    value?: number;
    onValueChange?: (newValue: number) => void;
    fixedPoints?: number; // Number of decimal places
    min?: number; // Minimum value
    max?: number; // Maximum value
    step?: number;
    style?: StyleProp<ViewStyle> | undefined;
    inputProps?: TextInputProps | undefined;
}

const DoubleSpinBox: React.FC<DoubleSpinBoxProps> = ({
    value = 0,
    onValueChange,
    fixedPoints = 3, // Default to 3 decimal places
    min = 0, // Default min value
    max = 100, // Default max value
    step = 1,
    style = null,
    inputProps = null,
}: DoubleSpinBoxProps) => {
    const [currentValue, setCurrentValue] = useState<string>(value.toFixed(fixedPoints));
    const [error, setError] = useState<string | null>(null);
    // const inputRef = useRef<NativeTextInput>(null); // To hold reference to the TextInput

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
            setError(`Value must be at least ${min}`)
        } else if (numericValue > max) {
            setError(`Value must be at most ${max}`)
        } else {
            setError(null)
        }

        setCurrentValue(isNegative && numericValue == 0 ? "-" + newValue : newValue);
        if (onValueChange) onValueChange(numericValue);
    };

    // Add input at the end of the text or handle backspace
    const processKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
        const key = e.nativeEvent.key;

        if (key === '-' || key === '+') {
            // Handle negative sign
            if (!currentValue.includes('-')) {
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
        } else {
            const numValue = parseFloat(currentValue)
            if (key === 'ArrowUp') {
                handleInputChange((numValue + step).toFixed(fixedPoints))
            } else if (key === 'ArrowDown') {
                handleInputChange((numValue - step).toFixed(fixedPoints))
            }
        }
    };

    return (
        <View style={style} >
            <TextInput
                {...inputProps}
                keyboardType="numeric"
                error={!!error}
                value={currentValue} // Display the current value
                onKeyPress={processKeyPress} // Handle key press for input and backspace
            />
            <HelperText type="error" visible={!!error}>
                {error}
            </HelperText>
            {/* {error && <HelperText type="error">{error}</HelperText>} */}
        </View>
    );
};

export default DoubleSpinBox;
