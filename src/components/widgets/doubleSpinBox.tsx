import React, { useState } from 'react';
import {
  View,
  NativeSyntheticEvent,
  TextInputKeyPressEventData
} from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';
import { Props as TextInputProps } from "react-native-paper/src/components/TextInput/TextInput";
import { StyleProp, ViewStyle } from 'react-native';

interface DoubleSpinBoxProps {
  value?: number;
  onValueChange?: (newValue: number) => void;
  fixedPoints?: number; // Number of decimal places
  min?: number; // Minimum value
  max?: number; // Maximum value
  step?: number; // Step increment/decrement value
  style?: StyleProp<ViewStyle>; // Style for the container
  inputProps?: TextInputProps; // Additional props for the TextInput
}

const DoubleSpinBox: React.FC<DoubleSpinBoxProps> = ({
  value = 0,
  onValueChange,
  fixedPoints = 3, // Default to 3 decimal places
  min = 0, // Default min value
  max = 100, // Default max value
  step = 1,
  style,
  inputProps
}) => {
  const [currentValue, setCurrentValue] = useState<string>(value.toFixed(fixedPoints));
  const [error, setError] = useState<string | null>(null);

  // Handle digit input from keyboard
  const handleInputChange = (text: string) => {
    const sanitizedText = text.replace(/(?!^-)[^0-9]/g, '');

    if (sanitizedText === '') {
      setCurrentValue('0'.padEnd(fixedPoints + 1, '0'));
      onValueChange?.(0);
      return;
    }

    const isNegative = sanitizedText.startsWith('-');
    const parsedValue = parseInt(sanitizedText, 10);
    const newValue = (parsedValue / Math.pow(10, fixedPoints)).toFixed(fixedPoints);
    const numericValue = parseFloat(newValue);

    // Validation
    if (numericValue < min) {
      setError(`Value must be at least ${min}`);
    } else if (numericValue > max) {
      setError(`Value must be at most ${max}`);
    } else {
      setError(null);
    }

    setCurrentValue(isNegative && numericValue === 0 ? "-" + newValue : newValue);
    onValueChange?.(numericValue);
  };

  // Add input at the end of the text or handle backspace
  const processKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    const key = e.nativeEvent.key;

    if (key === '-' || key === '+') {
      handleInputChange(!currentValue.includes('-') ? '-' + currentValue : currentValue.slice(1));
    } else if (!isNaN(Number(key))) {
      const appendedText = currentValue.replace(/(?!^-)[^0-9]/g, '') + key.replace(/[^0-9]/g, '');
      handleInputChange(appendedText);
    } else if (key === 'Backspace') {
      handleInputChange(parseFloat(currentValue) === 0 ? "0" : currentValue.slice(0, -1));
    } else {
      const numValue = parseFloat(currentValue);
      if (key === 'ArrowUp') {
        handleInputChange((numValue + step).toFixed(fixedPoints));
      } else if (key === 'ArrowDown') {
        handleInputChange((numValue - step).toFixed(fixedPoints));
      }
    }
  };

  return (
    <View style={style}>
      <TextInput
        {...inputProps}
        keyboardType="numeric"
        error={!!error}
        value={currentValue}
        onKeyPress={processKeyPress}
      />
      <HelperText type="error" visible={!!error}>
        {error}
      </HelperText>
    </View>
  );
};

export default DoubleSpinBox;
