import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { HitResult } from "js-ballistics";
import { makeShot, prepareCalculator, PreparedZeroData, shootTheTarget, CurrentConditionsType } from "../utils/ballisticsCalculator";
import { useProfile } from "./profileContext";
import { useCurrentConditions } from "./currentConditions";

export interface CalculatorContextType {
    calculator: PreparedZeroData | null;
    hitResult: HitResult | null | Error;
    adjustedResult: HitResult | null | Error;
    fire: () => Promise<void>;
    inProgress: boolean;
}


export const CalculatorContext = createContext<CalculatorContextType | null>(null);


export const CalculatorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [calculator, setCalculator] = useState<PreparedZeroData | null>(null);
    const [hitResult, setHitResult] = useState<HitResult | Error | null>(null);
    const [adjustedResult, setAdjustedResult] = useState<HitResult | Error | null>(null);
    const [inProgress, setInProgress] = useState<boolean>(false);

    const profileProperties = useProfile()
    const currentConditions = useCurrentConditions()

    const _profileProperties = useMemo(() => {
        return {
            ...profileProperties.profileProperties,
            rTwist: profileProperties.rTwist.asDef,
            scHeight: profileProperties.scHeight.asDef,
            cZeroWPitch: profileProperties.cZeroWPitch.asDef,
            zeroDistance: profileProperties.zeroDistance.asDef,
            cMuzzleVelocity: profileProperties.cMuzzleVelocity.asDef,
            cZeroTemperature: profileProperties.cZeroTemperature.asDef,
            cTCoeff: profileProperties.cTCoeff.value,
            bDiameter: profileProperties.bDiameter.asDef,
            bLength: profileProperties.bLength.asDef,
            bWeight: profileProperties.bWeight.asDef,
            cZeroAirHumidity: profileProperties.cZeroAirHumidity.value,
            cZeroAirTemperature: profileProperties.cZeroAirTemperature.asDef,
            cZeroAirPressure: profileProperties.cZeroAirPressure.asDef,
            cZeroPTemperature: profileProperties.cZeroPTemperature.asDef,
        }
    }, [profileProperties])

    // Map ConditionsContextType → CurrentConditionsType (fixes humidity: NumeralProps → number)
    const _currentConditions: CurrentConditionsType = useMemo(() => ({
        flags: {
            usePowderSens: currentConditions.flags?.usePowderSens ?? true,
            useDifferentPowderTemperature: currentConditions.flags?.useDifferentPowderTemperature ?? false,
        },
        temperature: currentConditions.temperature,
        pressure: currentConditions.pressure,
        humidity: currentConditions.humidity.value,
        windSpeed: currentConditions.windSpeed,
        windDirection: currentConditions.windDirection,
        lookAngle: currentConditions.lookAngle,
        targetDistance: currentConditions.targetDistance,
        powderTemperature: currentConditions.powderTemperature,
    }), [currentConditions])

    const zero = async () => {
        const preparedCalculator = await prepareCalculator(_profileProperties, _currentConditions);
        setCalculator(preparedCalculator);
        return preparedCalculator;
    }

    const fire = async () => {
        // Guard: don't fire if profile isn't loaded yet
        if (!_profileProperties?.coefRows || !_profileProperties?.bcType) {
            console.warn('Profile not loaded, skipping fire')
            return
        }

        setInProgress(true);

        setTimeout(async () => {
            try {
                const currentCalc: PreparedZeroData = await zero();
                if (currentCalc) {
                    if (!currentCalc.error) {
                        const result = await makeShot(_profileProperties, currentCalc, _currentConditions);
                        const adjustedResult = await shootTheTarget(_profileProperties, currentCalc, _currentConditions);

                        setHitResult(result);
                        setAdjustedResult(adjustedResult);
                    } else {
                        setHitResult(currentCalc.error);
                    }
                }
            } catch (error) {
                console.error('Error during fire:', error);
            } finally {
                setInProgress(false);
            }
        }, 10);
    };

    return (
        <CalculatorContext.Provider value={{
            calculator,
            hitResult,
            adjustedResult,
            fire,
            inProgress,
        }}>
            {children}
        </CalculatorContext.Provider>
    )
}


export const useCalculator = () => {
    const context = useContext(CalculatorContext);
    if (!context) {
        throw new Error('useCalculator must be used within a CalculatorProvider');
    }
    return context;
};
