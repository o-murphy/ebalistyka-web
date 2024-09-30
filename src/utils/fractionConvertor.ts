export default function getFractionDigits(precisionInOriginalUnit, conversionFactor) {
    // Convert precision in the original unit to the target unit
    const precisionInTargetUnit = precisionInOriginalUnit * conversionFactor;
    
    // Calculate the optimal number of fraction digits
    const fractionDigits = Math.max(0, Math.ceil(Math.log10(1 / precisionInTargetUnit)));
    
    return fractionDigits;
}