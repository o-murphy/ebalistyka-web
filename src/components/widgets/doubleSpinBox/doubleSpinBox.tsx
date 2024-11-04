import { useCallback, useEffect, useRef, useState } from 'react';
import { NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Props as TextInputProps } from "react-native-paper/src/components/TextInput/TextInput";
import { debounce } from 'lodash';

export interface SpinBoxProps {
  value?: number;
  onValueChange?: (newValue: number) => void;
  fractionDigits?: number; // Number of decimal places
  minValue?: number; // Minimum value
  maxValue?: number; // Maximum value
  step?: number; // Step increment/decrement value
  inputProps?: TextInputProps; // Additional props for the TextInput
  strict?: boolean;
  onError?: (error: Error) => void;
  debounceDelay?: number;
}


// const generateRandomId = () => {
//   return `id-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
// };


export const DoubleSpinBox: React.FC<SpinBoxProps> = ({
  value = 0,
  onValueChange,
  fractionDigits: fixedPoints = 3, // Default to 3 decimal places
  minValue: min = 0, // Default min value
  maxValue: max = 100, // Default max value
  step = 1,
  inputProps,
  strict = false,
  onError = null,
  debounceDelay = 500
}) => {
  const [currentValue, setCurrentValue] = useState<string>(value.toFixed(fixedPoints));
  const [error, setError] = useState<string | Error | null>(null);

  // const inputAccessoryViewID = generateRandomId();

  useEffect(() => {
    setCurrentValue(value.toFixed(fixedPoints))
  }, [value])

  const onErrorSet = (error) => {
    setError(error)
    onError?.(error)
  }

  // Debounced callback for onValueChange
  // const debouncedValueChange = useCallback(
  //   debounce((numericValue: number) => {
  //     onValueChange?.(numericValue);
  //   }, debounceDelay),
  //   [onValueChange]
  // );

  const valueChanged = (value) => onValueChange?.(value)

  // Handle digit input from keyboard
  const handleInputChange = (text: string) => {
    const sanitizedText = text.replace(/(?!^-)[^0-9]/g, '');

    if (sanitizedText === '') {
      setCurrentValue('0'.padEnd(fixedPoints + 1, '0'));
      // debouncedValueChange(0);
      valueChanged(0);
      return;
    }

    const isNegative = sanitizedText.startsWith('-');
    const parsedValue = parseInt(sanitizedText, 10);
    const newValue = (parsedValue / Math.pow(10, fixedPoints)).toFixed(fixedPoints);
    const numericValue = parseFloat(newValue);

    let _error = null;
    // Validation
    if (numericValue < min) {
      _error = new Error(`Value must be at least ${min}`);
    } else if (numericValue > max) {
      _error = new Error(`Value must be at most ${max}`);
    } else {
      _error = null
    }

    onErrorSet(_error)
    setCurrentValue(isNegative && numericValue === 0 ? "-" + newValue : newValue);

    if (strict && _error) {
      return;
    }
    // debouncedValueChange(numericValue);
    valueChanged(numericValue);
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
    <>
      <TextInput
        {...inputProps}
        // keyboardType="default"  // NOTE: android only
        keyboardType="numbers-and-punctuation"  // NOTE: ios only
        returnKeyType="done" // Customize return key type

        error={!!error}
        value={currentValue}
        onKeyPress={processKeyPress}
        onChange={e => handleInputChange(e.nativeEvent.text)}

        // inputAccessoryViewID={inputAccessoryViewID}
      />

      {/* NOTE: Additional keys for IOS keyboard*/}
      {/* <InputAccessoryView nativeID={inputAccessoryViewID}
      >
        <View style={{
          width: Dimensions.get('window').width,
          height: 48,
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center',
          backgroundColor: '#000000',
          paddingHorizontal: 8,
        }}>
          <IconButton
            icon={"minus-thick"}
            onPress={() => { console.log("minus"); handleInputChange(!currentValue.includes('-') ? '-' + currentValue : currentValue.slice(1));}}
          />
          <IconButton
            icon={"chevron-down-box"}
            onPress={() => {console.log("close")}}
          />
        </View>
      </InputAccessoryView> */}
    </>

  );
};