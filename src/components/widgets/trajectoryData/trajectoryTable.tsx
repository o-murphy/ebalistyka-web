import { useCalculator } from '../../../context/profileContext';
import { TrajectoryTable } from './abstract';


export const ZeroTable = () => {
    const { hitResult } = useCalculator()
    return (
      <TrajectoryTable hitResult={hitResult}/>
    )
};



export const AdjustedTable = () => {
    const { adjustedResult } = useCalculator()

    return (
      <TrajectoryTable hitResult={adjustedResult} reverse={true}/>
    )
};