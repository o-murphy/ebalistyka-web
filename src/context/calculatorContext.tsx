import { getGlobalUsePowderSensitivity, HitResult, setGlobalUsePowderSensitivity } from "js-ballistics/dist/v2";
import { createContext, ReactNode, useContext, useState } from "react";
import { makeShot, prepareCalculator, PreparedZeroData, shootTheTarget } from "../utils/ballisticsCalculator";
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

    const {
        profileProperties, rTwist, scHeight, cZeroWPitch, zeroDistance, cMuzzleVelocity,
        cZeroTemperature, cTCoeff, bDiameter, bLength, bWeight,
        cZeroAirHumidity, cZeroAirPressure, cZeroAirTemperature, cZeroPTemperature
    } = useProfile()

    const currentConditions = useCurrentConditions()

    const zero = () => {
        const _profileProperties = {
            ...profileProperties,
            rTwist: rTwist.asDef,
            scHeight: scHeight.asDef,
            cZeroWPitch: cZeroWPitch.asDef,
            zeroDistance: zeroDistance.asDef,
            cMuzzleVelocity: cMuzzleVelocity.asDef,
            cZeroTemperature: cZeroTemperature.asDef,
            cTCoeff: cTCoeff.value,
            bDiameter: bDiameter.asDef,
            bLength: bLength.asDef,
            bWeight: bWeight.asDef,
            cZeroAirHumidity: cZeroAirHumidity.value,
            cZeroAirTemperature: cZeroAirTemperature.asDef,
            cZeroAirPressure: cZeroAirPressure.asDef,
            cZeroPTemperature: cZeroPTemperature.asDef,
        }
        const preparedCalculator = prepareCalculator(_profileProperties, currentConditions);
        setCalculator(preparedCalculator);
        return preparedCalculator;
    }

    const fire = async () => {
        setInProgress(true); // Set loading state before beginning async operations

        // Wrap main calculation in a setTimeout to allow the UI to update first
        setTimeout(async () => {
            try {
                // must use powder sense
                // setGlobalUsePowderSensitivity(currentConditions.flags.usePowderSens)
                // console.log("Use powder sens.", getGlobalUsePowderSensitivity())
                console.log("Use powder sens.", currentConditions.flags.usePowderSens)

                const currentCalc: PreparedZeroData = zero();
                if (currentCalc) {
                    if (!currentCalc.error) {
                        const result = makeShot(profileProperties, currentCalc, currentConditions);
                        const adjustedResult = shootTheTarget(profileProperties, currentCalc, currentConditions);

                        setHitResult(result);
                        setAdjustedResult(adjustedResult);
                    } else {
                        setHitResult(currentCalc.error);
                    }
                }
            } catch (error) {
                console.error('Error during fire:', error);
            } finally {
                setInProgress(false); // Ensure loading state is reset after calculations
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