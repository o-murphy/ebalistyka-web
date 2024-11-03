import { useCalculator } from '../../../context/profileContext';
import { usePreferredUnits } from '../../../context/preferredUnitsContext';
import { WindageChart } from './abstract';
import { UNew } from 'js-ballistics/dist/v2';


export const HorizontalWindageChart = () => {
    const { hitResult, currentConditions } = useCalculator();
    const { preferredUnits } = usePreferredUnits();
    return <WindageChart results={hitResult} preferredUnits={preferredUnits} maxDistance={UNew.Meter(currentConditions.trajectoryRange)}/>
}

export const AdjustedWindageChart = () => {
    const { adjustedResult, currentConditions } = useCalculator();
    const { preferredUnits } = usePreferredUnits();
    return <WindageChart results={adjustedResult} preferredUnits={preferredUnits} maxDistance={UNew.Meter(currentConditions.trajectoryRange)}/>
}