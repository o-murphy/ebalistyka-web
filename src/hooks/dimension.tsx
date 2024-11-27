import { useState, useEffect, useMemo } from 'react';
import { usePreferredUnits } from '../context';
import { AbstractUnit, Measure, Unit, UnitProps, Pressure, Temperature, Velocity, Angular, Distance, Weight } from 'js-ballistics';

type MeasureType = (typeof Measure)[keyof typeof Measure];

// Helper function to calculate fraction digits
function getFractionDigits(precisionInOriginalUnit: number, conversionFactor: number): number {
    const precisionInTargetUnit = precisionInOriginalUnit * conversionFactor;
    return Math.max(0, Math.ceil(Math.log10(1 / precisionInTargetUnit)));
}

// Type definition for DimensionRange
export interface ValueRange {
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
    rangePref: ValueRange;
    // reset: () => void;
    accuracy: number;
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

    // const reset = useCallback(() => setLocalValue(new measure(0, defUnit)), [defUnit]);

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
        // reset,
        accuracy
    };
};



export interface UseNumeralArgs {
    symbol: string;
    range: ValueRange;
}

export interface NumeralProps {
    range: ValueRange;
    value: number;
    setValue: (value: number) => void;
    isValid: boolean;
    asString: string;
    symbol: string;
    // reset: () => void;
    accuracy: number;
}

export const useNumeral = ({ symbol, range }: UseNumeralArgs): NumeralProps => {

    const [value, setValue] = useState(0);

    const { min, max, accuracy } = range;

    const isValid = useMemo(() => value >= min && value <= max, [value])

    const asString = useMemo(() => `${value.toFixed(accuracy)} ${symbol}`, [value])

    return {
        value, setValue,
        range, symbol, asString,
        isValid, accuracy
    }
}


export const dimensions: Record<string, UseDimensionArgs> = {
    temperature: {
        measure: Temperature,
        defUnit: Unit.Celsius,
        prefUnitFlag: "temperature",
        min: -50,
        max: 50,
        precision: 2
    },
    powderTemperature: {
        measure: Temperature,
        defUnit: Unit.Celsius,
        prefUnitFlag: "temperature",
        min: -50,
        max: 50,
        precision: 2
    },
    pressure: {
        measure: Pressure,
        defUnit: Unit.hPa,
        prefUnitFlag: "pressure",
        min: 870,
        max: 1084,
        precision: 1
    },
    windSpeed: {
        measure: Velocity,
        defUnit: Unit.MPS,
        prefUnitFlag: "velocity",
        min: 0,
        max: 100,
        precision: 1
    },
    windDirection: {
        measure: Angular,
        defUnit: Unit.Degree,
        prefUnitFlag: "angular",
        min: 0,
        max: 360,
        precision: 1
    },
    lookAngle: {
        measure: Angular,
        defUnit: Unit.Degree,
        prefUnitFlag: "angular",
        min: -90,
        max: 90,
        precision: 0.1
    },
    targetDistance: {
        measure: Distance,
        defUnit: Unit.Meter,
        prefUnitFlag: "distance",
        min: 0,
        max: 3000,
        precision: 1
    },
    // }

    // const dimensions: Record<string, UseDimensionArgs> = {
    scHeight: {
        measure: Distance,
        defUnit: Unit.Millimeter,
        prefUnitFlag: "sizes",
        min: 0,
        max: 200,
        precision: 1
    },
    rTwist: {
        measure: Distance,
        defUnit: Unit.Inch,
        prefUnitFlag: "sizes",
        min: 0,
        max: 100,
        precision: 0.01
    },
    cZeroWPitch: {
        measure: Angular,
        defUnit: Unit.Degree,
        prefUnitFlag: "angular",
        min: -90,
        max: 90,
        precision: 1
    },
    zeroDistance: {
        measure: Distance,
        defUnit: Unit.Meter,
        prefUnitFlag: "distance",
        min: 0,
        max: 3000,
        precision: 1
    },
    cMuzzleVelocity: {
        measure: Velocity,
        defUnit: Unit.MPS,
        prefUnitFlag: "velocity",
        min: 0,
        max: 2000,
        precision: 1
    },
    cZeroPTemperature: {
        measure: Temperature,
        defUnit: Unit.Celsius,
        prefUnitFlag: "temperature",
        min: -50,
        max: 50,
        precision: 1
    },
    bDiameter: {
        measure: Distance,
        defUnit: Unit.Inch,
        prefUnitFlag: "sizes",
        min: 0,
        max: 6.1,
        precision: 0.001
    },
    bLength: {
        measure: Distance,
        defUnit: Unit.Inch,
        prefUnitFlag: "sizes",
        min: 0,
        max: 23.6,
        precision: 0.001
    },
    bWeight: {
        measure: Weight,
        defUnit: Unit.Grain,
        prefUnitFlag: "weight",
        min: 0,
        max: 112038.9,
        precision: 0.1
    },
}

export const numerals: Record<string, UseNumeralArgs> = {
    cTCoeff: {
        symbol: "%/15°C",
        range: {
            min: 0,
            max: 100,
            accuracy: 2
        }
    },
    humidity: {
        symbol: "%",
        range: {
            min: 0,
            max: 100,
            accuracy: 0
        }
    }
}