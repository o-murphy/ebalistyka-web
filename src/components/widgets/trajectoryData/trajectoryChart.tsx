import React from 'react';
import { useCalculator } from '../../../context/profileContext';
import { usePreferredUnits } from '../../../context/preferredUnitsContext';
import { TrajectoryChart, WindageChart } from './abstract';
import { useTableSettings } from '../../../context/tableSettingsContext';
import { HitResult } from 'js-ballistics';


const filterTrajectory = (hitResult: HitResult) => {
  const { trajectoryStep, trajectoryRange} = useTableSettings()

  const trajectoryStepRaw = trajectoryStep.value.rawValue
  const trajectoryRangeRaw = trajectoryRange.value.rawValue + 1

  let trajectory = [];

  for (let i = 0; i <= trajectoryRangeRaw; i += trajectoryStepRaw) {
    const closestValue = hitResult?.trajectory.reduce((closest, item) => {
      const itemDifference = Math.abs(item.distance.rawValue - i);
      const closestDifference = Math.abs(closest.distance.rawValue - i);
      return itemDifference < closestDifference ? item : closest;
    }, hitResult.trajectory[0]); // Start with the first element as the initial closest

    if (closestValue) {
      trajectory.push(closestValue);
    }
  }

  return trajectory
}


export const HorizontalTrajectoryChart = () => {
  const { hitResult } = useCalculator();
  const { preferredUnits } = usePreferredUnits();

  const trajectory = filterTrajectory(hitResult)
  return <TrajectoryChart results={hitResult} trajectory={trajectory} preferredUnits={preferredUnits} maxDistance={hitResult.trajectory[hitResult.trajectory.length - 1].distance} />
};

export const AdjustedTrajectoryChart = () => {
  const { adjustedResult: hitResult } = useCalculator();
  const { preferredUnits } = usePreferredUnits();

  const trajectory = filterTrajectory(hitResult)

  return <TrajectoryChart results={hitResult} trajectory={trajectory} preferredUnits={preferredUnits} maxDistance={hitResult.trajectory[hitResult.trajectory.length - 1].distance} />
};


export const HorizontalWindageChart = () => {
  const { hitResult } = useCalculator();
  const { preferredUnits } = usePreferredUnits();

  const trajectory = filterTrajectory(hitResult)

  return <WindageChart results={hitResult} trajectory={trajectory} preferredUnits={preferredUnits} maxDistance={hitResult.trajectory[hitResult.trajectory.length - 1].distance}/>
}

export const AdjustedWindageChart = () => {
  const { adjustedResult: hitResult } = useCalculator();
  const { preferredUnits } = usePreferredUnits();

  const trajectory = filterTrajectory(hitResult)

  return <WindageChart results={hitResult} trajectory={trajectory} preferredUnits={preferredUnits} maxDistance={hitResult.trajectory[hitResult.trajectory.length - 1].distance}/>
}