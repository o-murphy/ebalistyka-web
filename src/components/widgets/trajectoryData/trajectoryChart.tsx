import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Text } from 'react-native';
import { useTheme } from '../../../context/themeContext';
import { useProfile } from '../../../context/profileContext';
import { usePreferredUnits } from '../../../context/preferredUnitsContext';
import { Unit } from 'js-ballistics/dist/v2';


function findOppositeLeg(hypotenuse, angleInDegrees) {
    const angleInRadians = angleInDegrees * (Math.PI / 180);
    const oppositeLeg = hypotenuse * Math.sin(angleInRadians);
    return oppositeLeg;
}

const TrajectoryChart = () => {
  const { theme } = useTheme();
  const { hitResult } = useProfile();
  const { preferredUnits } = usePreferredUnits();

  if (hitResult instanceof Error) return (
    <Text>Can't display chart</Text>
  );

  const result = hitResult.trajectory;

  // Mapping the data to Recharts format
  const data = result.map(row => ({
    distance: row.distance.In(preferredUnits.distance).toFixed(0),
    velocity: row.velocity.In(preferredUnits.velocity),
    adjustment: findOppositeLeg(
      row.lookDistance.In(preferredUnits.drop),
      hitResult.shot.lookAngle.In(Unit.Degree)
    ),
    barrelLine: findOppositeLeg(
      row.lookDistance.In(preferredUnits.drop),
      hitResult.shot.barrelElevation.In(Unit.Degree)
    ) - hitResult.shot.weapon.sightHeight.In(preferredUnits.drop),
    height: row.height.In(preferredUnits.drop),
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{ top: 50, right: 50, left: 50, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="distance" label={{ value: 'Distance', position: 'insideBottomRight', offset: 0 }} />
        
        {/* Left Y-Axis for Height */}
        <YAxis yAxisId="left" label={{ value: 'Height', angle: -90, position: 'insideLeft' }} />
        
        {/* Right Y-Axis for Velocity */}
        <YAxis yAxisId="right" orientation="right" label={{ value: 'Velocity', angle: -90, position: 'insideRight' }} />
        
        <Tooltip />
        <Legend />

        {/* Line for Velocity (Right Y-Axis) */}
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="velocity"
          stroke={theme.colors.primary}
          dot={false}
        />

        {/* Line for Adjustment (uses left Y-Axis) */}
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="adjustment"
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
          stroke="#82ca9d"
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