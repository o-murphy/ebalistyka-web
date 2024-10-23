import { useState, useEffect, useRef, useCallback } from 'react';
import { debounce } from 'lodash';

const useDebouncedValue = (initialValue: number, delay: number, updateValue: (value: number) => void) => {
    const [tempValue, setTempValue] = useState(initialValue);
    const debouncedUpdate = useRef(debounce(updateValue, delay)).current;

    const setValue = useCallback((value: number) => {
        setTempValue(value);
        debouncedUpdate(value);
    }, [debouncedUpdate]);

    return [tempValue, setValue] as const;
};

export default useDebouncedValue;