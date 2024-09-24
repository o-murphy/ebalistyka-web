import { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useProfile } from '../../context/profileContext'; // Path to where you created the context
import { prepareCalculator } from '../../utils/ballisticsCalculator';
import TrajectoryChart from './trajectoryChart';
import TrajectoryTable from './trajectoryTable';
import {
  preferredUnits, Unit
} from 'js-ballistics/dist/v2';
import { ActivityIndicator } from 'react-native-paper';
import A7PFileUploader from './fileDrop';
import WindageChart from './windageChart';

preferredUnits.distance = Unit.Meter
preferredUnits.velocity = Unit.MPS
preferredUnits.angular = Unit.Degree
preferredUnits.adjustment = Unit.MIL
preferredUnits.drop = Unit.Centimeter

export default function TrajectoryData({ EXAMPLE_A7P = null }) {
  const { calculator, profileProperties, fetchBinaryFile } = useProfile();
  // const [calculatorData, setCalculatorData] = useState(null);

  // TODO: remove spinners if no file loaded
  // useEffect(() => {
  //   // Load the file when the component mounts
  //   fetchBinaryFile(EXAMPLE_A7P);
  // }, [EXAMPLE_A7P]);

  // useEffect(() => {
  //   if (profileProperties) {
  //     const preparedCalculator = prepareCalculator(profileProperties);
  //     setCalculatorData(preparedCalculator);
  //   }
  // }, [profileProperties]);

  return (
    (profileProperties && calculator) ? (
      <View style={styles.container}>
        <TrajectoryTable />
        <TrajectoryChart />
        <WindageChart />
      </View>
    ) : (
      <View style={[styles.container, {padding: 15}]}>
        {/* <ActivityIndicator animating={true} /> */}
        <A7PFileUploader />
      </View>
    )
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});