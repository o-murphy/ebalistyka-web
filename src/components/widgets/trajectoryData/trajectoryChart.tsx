import React from 'react';
import { useCalculator } from '../../../context/profileContext';
import { usePreferredUnits } from '../../../context/preferredUnitsContext';
import { TrajectoryChart } from './abstract';
import { UNew } from 'js-ballistics/dist/v2';
import { useCurrentConditions } from '../../../context/currentConditions';

export const HorizontalTrajectoryChart = () => {
  const { hitResult } = useCalculator();
  const { preferredUnits } = usePreferredUnits();
  return <TrajectoryChart results={hitResult} preferredUnits={preferredUnits} maxDistance={hitResult.trajectory[hitResult.trajectory.length - 1].distance} />
};

export const AdjustedTrajectoryChart = () => {
  const { adjustedResult } = useCalculator();
  const { preferredUnits } = usePreferredUnits();
  return <TrajectoryChart results={adjustedResult} preferredUnits={preferredUnits} maxDistance={adjustedResult.trajectory[adjustedResult.trajectory.length - 1].distance} />
};
