import { useEffect, useState } from 'react';
import {
  View,
  NativeSyntheticEvent,
  TextInputKeyPressEventData
} from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';
import { SpinBoxProps } from './doubleSpinBox';


const PosTypeSpinBox: React.FC<SpinBoxProps> = ({
  value = 0,
  onValueChange,
  fractionDigits: fixedPoints = 3, // Default to 3 decimal places
  minValue: min = 0, // Default min value
  maxValue: max = 100, // Default max value
  step = 1,
  style,
  inputProps,
  strict = false
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
        // keyboardType="numeric"
        keyboardType="default"
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

export default PosTypeSpinBox;
