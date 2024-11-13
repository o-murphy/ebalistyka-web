import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { CurrentConditionsProps } from '../utils/ballisticsCalculator';
import { DimensionProps, useDimension, dimensions, useNumeral, numerals, NumeralProps } from '../hooks/dimension';





interface ConditionsContextType {
    currentConditions: CurrentConditionsProps;
    setCurrentConditions: (value: CurrentConditionsProps) => void;
    updateCurrentConditions: (value: Partial<CurrentConditionsProps>) => void;
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
    const [currentConditions, setCurrentConditions] = useState<CurrentConditionsProps | null>(defaultConditions);

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
            const conditionsValueParsed: CurrentConditionsProps = JSON.parse(conditionsValue)
            setCurrentConditions(conditionsValueParsed || defaultConditions)

            temperature.setAsDef(conditionsValueParsed.temperature || 15)
            powderTemperature.setAsDef(conditionsValueParsed.powderTemperature || 15)
            pressure.setAsDef(conditionsValueParsed.pressure || 1000)
            windSpeed.setAsDef(conditionsValueParsed.windSpeed || 0)
            windDirection.setAsDef(conditionsValueParsed.windDirection || 0)
            lookAngle.setAsDef(conditionsValueParsed.lookAngle || 0)
            targetDistance.setAsDef(conditionsValueParsed.targetDistance || 100)
            humidity.setValue(conditionsValueParsed.humidity)
            console.log("Loaded conditions")
        };
        load();    
    }, []);

    useEffect(() => {
        const save = async (currentConditions) => {
            try {
                const jsonValue = JSON.stringify({
                    ...currentConditions,
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
        save(currentConditions);
    }, [
        currentConditions,
        temperature,
        powderTemperature,
        pressure,
        windSpeed,
        windDirection,
        lookAngle,
        targetDistance,
    ]);

    const updateCurrentConditions = (props: Partial<CurrentConditionsProps>) => {
        setCurrentConditions((prev) => ({ ...prev, ...props }));
    };

    return (
        <ConditionsContext.Provider value={{
            currentConditions,
            setCurrentConditions,
            updateCurrentConditions,
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


const defaultConditions: CurrentConditionsProps = {
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
