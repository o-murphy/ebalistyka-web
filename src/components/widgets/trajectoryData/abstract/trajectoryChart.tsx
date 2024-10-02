import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../../../context/themeContext';
import { Angular, Distance, HitResult, TrajectoryData, UNew, Unit, UnitProps, Velocity } from 'js-ballistics/dist/v2';
import { Card, Text } from 'react-native-paper';
import getFractionDigits from '../../../../utils/fractionConvertor';
import { ToolTipRow } from './tooltipRow';


function findOppositeLeg(hypotenuse, angleInDegrees) {
  const angleInRadians = angleInDegrees * (Math.PI / 180);
  const oppositeLeg = hypotenuse * Math.sin(angleInRadians);
  return oppositeLeg;
}

const TrajectoryTooltip = ({ active, label, payload, preferredUnits }) => {
  const { theme } = useTheme();


  if (active && payload && payload.length) {

    const distanceValue = `${label} ${UnitProps[preferredUnits.distance].symbol}`
    const velocityValue = `${payload[0].value}${UnitProps[preferredUnits.velocity].symbol}`;
    const heightValue = `${payload[3].value} ${UnitProps[preferredUnits.drop].symbol}`;
    const dropValue = `${payload[3].payload.drop} ${UnitProps[preferredUnits.drop].symbol}`;
    const dropAdjValue = `${payload[3].payload.dropAdjustment} ${UnitProps[preferredUnits.adjustment].symbol}`;

    return (
      <Card elevation={2} style={{ backgroundColor: `rgba(${theme.colors.primaryContainer}, 0.5)` }}>
        <Card.Content>
          <ToolTipRow label={`Distance:`} value={distanceValue} />
          <ToolTipRow label={`Velocity:`} value={velocityValue} />
          <ToolTipRow label={`Height:`} value={heightValue} />
          <ToolTipRow label={`Drop:`} value={dropValue} />
          <ToolTipRow label={`Adjustment:`} value={dropAdjValue} />
        </Card.Content>
      </Card>
    );
  }

  return null;
};

export interface WindageChartProps {
  results: HitResult | Error,
  preferredUnits: any
}

export const TrajectoryChart: React.FC<WindageChartProps> = ({
  results, preferredUnits
}) => {
  const { theme } = useTheme();

  if (results instanceof Error) return (
    <Text>Can't display chart</Text>
  );

  const heightAccuracy = getFractionDigits(0.1, UNew.Inch(1).In(preferredUnits.drop));
  const dropAdjAccuracy = getFractionDigits(0.01, UNew.MIL(1).In(preferredUnits.adjustment));
  const distanceAccuracy = getFractionDigits(1, UNew.Meter(1).In(preferredUnits.distance));
  const velocityAccuracy = getFractionDigits(1, UNew.MPS(1).In(preferredUnits.velocity));

  const roundHeight = (height: Distance) => {
    return parseFloat(height.In(preferredUnits.drop).toFixed(heightAccuracy));
  };

  const roundDistance = (distance: Distance) => {
    return parseFloat(distance.In(preferredUnits.distance).toFixed(distanceAccuracy));
  };

  const roundVelocity = (velocity: Velocity) => {
    return parseFloat(velocity.In(preferredUnits.velocity).toFixed(velocityAccuracy));
  };

  const roundDropAdj = (dropAdj: Angular) => {
    return parseFloat(dropAdj.In(preferredUnits.adjustment).toFixed(dropAdjAccuracy));
  };

  const prepareSightLine = (row: TrajectoryData) => {
    const windAdj = findOppositeLeg(
      row.lookDistance.In(preferredUnits.drop),
      results.shot.lookAngle.In(Unit.Degree)
    )
    return parseFloat(windAdj.toFixed(dropAdjAccuracy));
  };

  const prepareBarrelLine = (row: TrajectoryData) => {
    const barrelHeight = findOppositeLeg(
      row.lookDistance.In(preferredUnits.drop),
      results.shot.barrelElevation.In(Unit.Degree)
    ) - results.shot.weapon.sightHeight.In(preferredUnits.drop)
    return parseFloat(barrelHeight.toFixed(heightAccuracy))
  }

  const result = results.trajectory;

  // Mapping the data to Recharts format
  const data = result.map(row => ({
    distance: roundDistance(row.distance),
    velocity: roundVelocity(row.velocity),
    sightLine: prepareSightLine(row),
    barrelLine: prepareBarrelLine(row),
    height: roundHeight(row.height),

    drop: roundHeight(row.targetDrop),
    dropAdjustment: roundDropAdj(row.dropAdjustment)
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{ top: 50, right: 30, left: 30, bottom: 35 }} // Adjust bottom margin
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          type="number"
          dataKey="distance"
          domain={['dataMin', 'dataMax']}
          tickCount={20}
          interval={'preserveStartEnd'}
          label={{ value: 'Distance', position: 'insideBottom', offset: -30 }}
          angle={-90}
          textAnchor="end"
        />

        {/* Left Y-Axis for Height */}
        <YAxis yAxisId="left" label={{ value: 'Height', angle: -90, position: 'insideBottomLeft' }} />

        {/* Right Y-Axis for Velocity */}
        <YAxis yAxisId="right" orientation="right" label={{ value: 'Velocity', angle: -90, position: 'insideBottomRight' }} />

        {/* <Tooltip /> */}
        <Tooltip content={(props) => <TrajectoryTooltip {...props} preferredUnits={preferredUnits} />} />

        <Legend verticalAlign="top" layout="horizontal" wrapperStyle={{ paddingBottom: 10 }} />

        {/* Line for Velocity (Right Y-Axis) */}
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="velocity"
          stroke="#82ca9d"
          strokeWidth={2}
          dot={false}
        />

        {/* Line for Adjustment (uses left Y-Axis) */}
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="sightLine"
          stroke="orange"
          dot={false}
        />

        {/* Line for Barrel Line (uses left Y-Axis) */}
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="barrelLine"
          stroke={theme.colors.error}
          dot={false}
        />

        {/* Line for Height (uses left Y-Axis) */}
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="height"
          stroke={theme.colors.primary}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TrajectoryChart;

// import { Unit } from 'js-ballistics/dist/v2';
// import { StyleSheet } from 'react-native';
// import { useProfile } from '../../../context/profileContext';
// import { Text } from 'react-native-paper';
// import { useTheme } from '../../../context/themeContext';
// import CustomChart from '../adaptiveChart';
// import { usePreferredUnits } from '../../../context/preferredUnitsContext';


// function findOppositeLeg(hypotenuse, angleInDegrees) {
//     const angleInRadians = angleInDegrees * (Math.PI / 180);
//     const oppositeLeg = hypotenuse * Math.sin(angleInRadians);
//     return oppositeLeg;
// }

// const TrajectoryChart = () => {

//     const { theme } = useTheme()
//     const { hitResult } = useProfile()
//     const { preferredUnits } = usePreferredUnits()


//     if (hitResult instanceof Error) return (
//         <Text>Can't display chart</Text>
//     );

//     const result = hitResult.trajectory;

//     const data = {
//         labels: result.map((row) => row.distance.In(preferredUnits.distance).toFixed(0)),
//         datasets: [
//             {
//                 data: result.map((row) => row.velocity.In(preferredUnits.velocity)),
//                 // color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
//                 color: () => theme.colors.primary,
//             },
//             {
//                 data: result.map(row => findOppositeLeg(
//                     row.lookDistance.In(preferredUnits.drop),
//                     hitResult.shot.lookAngle.In(Unit.Degree)
//                 )),
//                 color: () => "orange",
//             },
//             {
//                 data: result.map(row => findOppositeLeg(
//                     row.lookDistance.In(preferredUnits.drop),
//                     hitResult.shot.barrelElevation.In(Unit.Degree)
//                 ) - hitResult.shot.weapon.sightHeight.In(preferredUnits.drop)),
//                 color: () => theme.colors.errorContainer,
//             },
//             {
//                 data: result.map((row) => row.height.In(preferredUnits.drop)),
//             },
//         ],
//         legend: [
//             "Velocity",
//             "Sight line",
//             "Barrel line",
//             "Height",
//         ],
//     };

//     return (
//         <CustomChart containerStyle={styles.customChart} data={data}
//             chartProps={{
//                 height: 480,
//                 verticalLabelRotation: -90,
//                 xLabelsOffset: 20,
//             }}
//         />
//     )
// };

// const styles = StyleSheet.create({
//     customChart: {
//         // flex: 1, justifyContent: "center"
//     }
// })

// export default TrajectoryChart;