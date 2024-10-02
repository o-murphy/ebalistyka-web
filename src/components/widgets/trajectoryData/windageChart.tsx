import { useProfile } from '../../../context/profileContext';
import { usePreferredUnits } from '../../../context/preferredUnitsContext';
import { WindageChart } from './abstract';


export const HorizontalWindageChart = () => {
    const { hitResult } = useProfile();
    const { preferredUnits } = usePreferredUnits();
    return <WindageChart results={hitResult} preferredUnits={preferredUnits}/>
}

export const AdjustedWindageChart = () => {
    const { adjustedResult } = useProfile();
    const { preferredUnits } = usePreferredUnits();
    return <WindageChart results={adjustedResult} preferredUnits={preferredUnits}/>
}