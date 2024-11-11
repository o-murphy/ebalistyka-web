import { useState, useEffect, useMemo, useCallback } from 'react';
import { AbstractUnit, Measure, Unit, UnitProps } from 'js-ballistics/dist/v2';
import { usePreferredUnits } from '../context/preferredUnitsContext';

type MeasureType = (typeof Measure)[keyof typeof Measure];

// Helper function to calculate fraction digits
function getFractionDigits(precisionInOriginalUnit: number, conversionFactor: number): number {
    const precisionInTargetUnit = precisionInOriginalUnit * conversionFactor;
    return Math.max(0, Math.ceil(Math.log10(1 / precisionInTargetUnit)));
}

// Type definition for DimensionRange
export interface DimensionRange {
    min: number;
    max: number;
    accuracy: number;
}

// Type definition for DimensionProps
export interface DimensionProps {
    value: AbstractUnit;
    setValue: (value: number | AbstractUnit) => void;
    isValid: boolean;
    asString: string;
    symbol: string;
    asDef: number;
    setAsDef: (value: number) => void;
    asPref: number;
    setAsPref: (value: number) => void;
    rangePref: DimensionRange;
    reset: () => void;
}

// Interface for the arguments passed to useDimension
export interface UseDimensionArgs {
    measure: MeasureType;
    defUnit: Unit;
    prefUnitFlag: string;
    min: number;
    max: number;
    precision: number;
}

// Custom hook to manage the dimension
export const useDimension = ({
    measure,
    defUnit,
    prefUnitFlag,
    min,
    max,
    precision
}: UseDimensionArgs): DimensionProps => {
    const { preferredUnits } = usePreferredUnits();
    const [localValue, setLocalValue] = useState<AbstractUnit>(new measure(0, defUnit));
    const [isValid, setIsValid] = useState(true);

    const symbol = UnitProps[preferredUnits[prefUnitFlag]].symbol;

    // Convert min and max values to the correct unit
    const localMin = new measure(min, defUnit);
    const localMax = new measure(max, defUnit);

    // Calculate the accuracy based on the precision
    const accuracy = useMemo(() => getFractionDigits(precision, new measure(1, defUnit).In(preferredUnits[prefUnitFlag])), [preferredUnits]);

    // Validate if the value is within the range
    const validate = (): boolean => localValue.rawValue >= localMin.rawValue && localValue.rawValue <= localMax.rawValue;

    useEffect(() => {
        setIsValid(validate());
    }, [localValue]);

    // Calculate range preferences (min, max, accuracy)
    const rangePref = useMemo(() => ({
        min: localMin.In(preferredUnits[prefUnitFlag]),
        max: localMax.In(preferredUnits[prefUnitFlag]),
        accuracy
    }), [preferredUnits, prefUnitFlag]);

    // Memoize the current value of the dimension
    const value = useMemo(() => localValue, [localValue]);

    // Set the value, either as a number or AbstractUnit
    const setValue = (value: number | AbstractUnit): void => {
        const newValue = typeof value === 'number' ? new measure(value, defUnit) : value;
        if (newValue instanceof measure) {
            setLocalValue(newValue);
        } else {
            throw new Error('Unsupported dimension value type');
        }
    };

    // Convert the value to the default unit
    const asDef = useMemo(() => localValue.In(defUnit), [localValue]);

    // Set the value as default unit
    const setAsDef = (value: number): void => {
        setLocalValue(new measure(value, defUnit));
    };

    // Convert the value to the preferred unit
    const asPref = useMemo(() => localValue.In(preferredUnits[prefUnitFlag]), [localValue, preferredUnits]);

    // Set the value as preferred unit
    const setAsPref = (value: number): void => {
        setLocalValue(new measure(value, preferredUnits[prefUnitFlag]));
    };

    // Convert the value to a string representation with the appropriate accuracy
    const asString = useMemo(() => localValue.In(preferredUnits[prefUnitFlag]).toFixed(accuracy), [localValue, preferredUnits, accuracy]);

    const reset = useCallback(() => setLocalValue(new measure(0, defUnit)), [defUnit]);

    return {
        value,
        setValue,
        isValid,
        asString,
        symbol,
        asDef,
        setAsDef,
        asPref,
        setAsPref,
        rangePref,
        reset
    };
};
