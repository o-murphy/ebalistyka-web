import { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProfileContext } from '../../providers/profileProvider'; // Path to where you created the context
import { prepareCalculator } from '../../utils/prepareCalculator';
import TrajectoryChart from './trajectoryChart';
import TrajectoryTable from './trajectoryTable';
import {
  preferredUnits, Unit
} from 'js-ballistics/dist/v2';
import { ActivityIndicator } from 'react-native-paper';

preferredUnits.distance = Unit.Meter
preferredUnits.velocity = Unit.MPS
preferredUnits.angular = Unit.Degree
preferredUnits.adjustment = Unit.MIL
preferredUnits.drop = Unit.Centimeter

export default function TrajectoryData({ EXAMPLE_A7P }) {
  const { profileProperties, fetchBinaryFile } = useContext(ProfileContext);
  const [calculatorData, setCalculatorData] = useState(null);

  useEffect(() => {
    // Load the file when the component mounts
    fetchBinaryFile(EXAMPLE_A7P);
  }, [EXAMPLE_A7P]);

  useEffect(() => {
    if (profileProperties) {
      const preparedCalculator = prepareCalculator(profileProperties);
      setCalculatorData(preparedCalculator);
    }
  }, [profileProperties]);

  return (
    (profileProperties && calculatorData) ? (
      <View style={styles.container}>
        <TrajectoryTable calculatorData={calculatorData} />
        <TrajectoryChart calculatorData={calculatorData} />
      </View>
    ) : (
      <View style={styles.container}>
        <ActivityIndicator animating={true} />
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