import React from 'react';
import { useCalculator } from '../../../context/profileContext';
import { usePreferredUnits } from '../../../context/preferredUnitsContext';
import { TrajectoryChart } from './abstract';

export const HorizontalTrajectoryChart = () => {
  const { hitResult } = useCalculator();
  const { preferredUnits } = usePreferredUnits();
  return <TrajectoryChart results={hitResult} preferredUnits={preferredUnits}/>
};

export const AdjustedTrajectoryChart = () => {
    const { adjustedResult } = useCalculator();
    const { preferredUnits } = usePreferredUnits();
    return <TrajectoryChart results={adjustedResult} preferredUnits={preferredUnits}/>
};
