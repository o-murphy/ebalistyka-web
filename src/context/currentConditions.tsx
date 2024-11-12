import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { CurrentConditionsProps } from '../utils/ballisticsCalculator';
import { DimensionProps, useDimension, UseDimensionArgs } from '../hooks/dimension';
import { Unit, Pressure, Temperature, Velocity, Angular, Distance } from 'js-ballistics/dist/v2';


const dimensions: Record<string, UseDimensionArgs> = {
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
    }
}


interface ConditionsContextType {
    currentConditions: CurrentConditionsProps;
    setCurrentConditions: (value: CurrentConditionsProps) => void;
    updateCurrentConditions: (value: Partial<CurrentConditionsProps>) => void;
    temperature: DimensionProps;
    pressure: DimensionProps;
    windSpeed: DimensionProps,
    windDirection: DimensionProps,
    lookAngle: DimensionProps,
    targetDistance: DimensionProps,
    powderTemperature: DimensionProps
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
