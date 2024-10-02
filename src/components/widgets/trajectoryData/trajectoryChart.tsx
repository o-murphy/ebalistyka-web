import React from 'react';
import { useProfile } from '../../../context/profileContext';
import { usePreferredUnits } from '../../../context/preferredUnitsContext';
import { TrajectoryChart } from './abstract';

export const HorizontalTrajectoryChart = () => {
  const { hitResult } = useProfile();
  const { preferredUnits } = usePreferredUnits();
  return <TrajectoryChart results={hitResult} preferredUnits={preferredUnits}/>
};

export const AdjustedTrajectoryChart = () => {
    const { adjustedResult } = useProfile();
    const { preferredUnits } = usePreferredUnits();
    return <TrajectoryChart results={adjustedResult} preferredUnits={preferredUnits}/>
};
