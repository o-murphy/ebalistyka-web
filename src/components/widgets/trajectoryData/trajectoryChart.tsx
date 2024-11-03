import React from 'react';
import { useCalculator } from '../../../context/profileContext';
import { usePreferredUnits } from '../../../context/preferredUnitsContext';
import { TrajectoryChart } from './abstract';
import { UNew } from 'js-ballistics/dist/v2';

export const HorizontalTrajectoryChart = () => {
  const { hitResult, currentConditions } = useCalculator();
  const { preferredUnits } = usePreferredUnits();
  return <TrajectoryChart results={hitResult} preferredUnits={preferredUnits} maxDistance={UNew.Meter(currentConditions.trajectoryRange)}/>
};

export const AdjustedTrajectoryChart = () => {
    const { adjustedResult, currentConditions } = useCalculator();
    const { preferredUnits } = usePreferredUnits();
    return <TrajectoryChart results={adjustedResult} preferredUnits={preferredUnits} maxDistance={UNew.Meter(currentConditions.targetDistance)}/>
};
