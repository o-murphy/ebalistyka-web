import { useEffect, useState } from 'react';
import {
  View,
  NativeSyntheticEvent,
  TextInputKeyPressEventData
} from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';
import { Props as TextInputProps } from "react-native-paper/src/components/TextInput/TextInput";
import { StyleProp, ViewStyle } from 'react-native';

export interface SpinBoxProps {
  value?: number;
  onValueChange?: (newValue: number) => void;
  fractionDigits?: number; // Number of decimal places
  minValue?: number; // Minimum value
  maxValue?: number; // Maximum value
  step?: number; // Step increment/decrement value
  style?: StyleProp<ViewStyle>; // Style for the container
  inputProps?: TextInputProps; // Additional props for the TextInput
  strict?: boolean;
  showError?: boolean;
}


export const DoubleSpinBox: React.FC<SpinBoxProps> = ({
  value = 0,
  onValueChange,
  fractionDigits: fixedPoints = 3, // Default to 3 decimal places
  minValue: min = 0, // Default min value
  maxValue: max = 100, // Default max value
  step = 1,
  style,
  inputProps,
  strict = false,
  showError = true,
}) => {
  const [currentValue, setCurrentValue] = useState<string>(value.toFixed(fixedPoints));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCurrentValue(value.toFixed(fixedPoints))
  }, [value])

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

    let _error = null;
    // Validation
    if (numericValue < min) {
      _error = `Value must be at least ${min}`;
    } else if (numericValue > max) {
      _error = `Value must be at most ${max}`;
    } else {
      _error = null
    }

    setError(_error)
    setCurrentValue(isNegative && numericValue === 0 ? "-" + newValue : newValue);

    if (strict && _error) {
      return;
    }
    onValueChange?.(numericValue);
  };

  // Add input at the end of the text or handle backspace
  const processKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    const key = e.nativeEvent.key;

    if (key === '-' || key === '+') {
      handleInputChange(!currentValue.includes('-') ? '-' + currentValue : currentValue.slice(1));
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
        keyboardType="default"
        error={!!error}
        value={currentValue}
        onKeyPress={processKeyPress}
        onChange={e => handleInputChange(e.nativeEvent.text)}
      />
      {showError && <HelperText type="error" visible={!!error}>
        {error}
      </HelperText>}
    </View>
  );
};