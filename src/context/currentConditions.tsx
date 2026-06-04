import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { CurrentConditionsValues } from '../utils/ballisticsCalculator';
import { DimensionProps, useDimension, dimensions, useNumeral, numerals, NumeralProps } from '../hooks';





export interface ConditionsContextType {
    flags: CurrentConditionsValues;
    setFlags: (value: CurrentConditionsValues) => void;
    updateFlags: (value: Partial<CurrentConditionsValues>) => void;
    temperature: DimensionProps;
    pressure: DimensionProps;
    windSpeed: DimensionProps;
    windDirection: DimensionProps;
    lookAngle: DimensionProps;
    targetDistance: DimensionProps;
    powderTemperature: DimensionProps;
    humidity: NumeralProps;
}


export const ConditionsContext = createContext<ConditionsContextType | null>(null);

export const ConditionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [flags, setFlags] = useState<CurrentConditionsValues | null>(defaultConditions);

    const temperature = useDimension(dimensions.temperature)
    const powderTemperature = useDimension(dimensions.powderTemperature)
    const pressure = useDimension(dimensions.pressure)
    const windSpeed = useDimension(dimensions.windSpeed)
    const windDirection = useDimension(dimensions.windDirection)
    const lookAngle = useDimension(dimensions.lookAngle)
    const targetDistance = useDimension(dimensions.targetDistance)

    const humidity = useNumeral(numerals.humidity)

    useEffect(() => {
        const load = async () => {
            const conditionsValue = await AsyncStorage.getItem('currentConditions');
            const conditionsValueParsed: CurrentConditionsValues = conditionsValue
                ? JSON.parse(conditionsValue)
                : null
            const c = conditionsValueParsed || defaultConditions
            setFlags(c)

            temperature.setAsDef(c.temperature ?? 15)
            powderTemperature.setAsDef(c.powderTemperature ?? 15)
            pressure.setAsDef(c.pressure ?? 1000)
            windSpeed.setAsDef(c.windSpeed ?? 0)
            windDirection.setAsDef(c.windDirection ?? 0)
            lookAngle.setAsDef(c.lookAngle ?? 0)
            targetDistance.setAsDef(c.targetDistance ?? 100)
            humidity.setValue(c.humidity ?? 50)
            console.log("Loaded conditions")
        };
        load();
    }, []);

    useEffect(() => {
        const save = async (flags) => {
            try {
                const jsonValue = JSON.stringify({
                    ...flags,
                    temperature: temperature.asDef,
                    powderTemperature: powderTemperature.asDef,
                    pressure: pressure.asDef,
                    windSpeed: windSpeed.asDef,
                    windDirection: windDirection.asDef,
                    lookAngle: lookAngle.asDef,
                    targetDistance: targetDistance.asDef,
                    humidity: humidity.value,
                });
                await AsyncStorage.setItem('currentConditions', jsonValue);
            } catch (error) {
                console.error('Failed to save current conditions:', error);
            }
        };
        save(flags);
    }, [
        flags,
        temperature,
        powderTemperature,
        pressure,
        windSpeed,
        windDirection,
        lookAngle,
        targetDistance,
    ]);

    const updateFlags = (props: Partial<CurrentConditionsValues>) => {
        setFlags((prev) => ({ ...prev, ...props }));
    };

    return (
        <ConditionsContext.Provider value={{
            flags,
            setFlags,
            updateFlags,
            temperature,
            pressure,
            powderTemperature,
            windSpeed,
            windDirection,
            lookAngle,
            targetDistance,
            humidity,
        }}>
            {children}
        </ConditionsContext.Provider>
    );
};

export const useCurrentConditions = () => {
    const context = useContext(ConditionsContext);
    if (!context) {
        throw new Error('useCurrentConditions must be used within a ConditionsProvider');
    }
    return context;
};


const defaultConditions: CurrentConditionsValues = {
    temperature: 15,
    pressure: 1000,
    humidity: 50,
    windSpeed: 0,
    windDirection: 0,
    lookAngle: 0,
    targetDistance: 100,
    usePowderSens: true,
    useDifferentPowderTemperature: false,
    powderTemperature: 15,
}
