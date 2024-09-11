import { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProfileLoaderContext } from '../../providers/profileLoaderProvider'; // Path to where you created the context
import { prepareCalculator } from '../../utils/prepareCalculator';
import TrajectoryChart from './trajectoryChart';
import TrajectoryTable from './trajectoryTable';
import {
  preferredUnits, Unit
} from 'js-ballistics/dist/v2';
import { ProfileProps } from '../../utils/parseA7P';

preferredUnits.distance = Unit.Meter
preferredUnits.velocity = Unit.MPS
preferredUnits.angular = Unit.Degree
preferredUnits.adjustment = Unit.MIL
preferredUnits.drop = Unit.Centimeter

export default function TrajectoryData({ EXAMPLE_A7P }) {
  const { fileContent, fetchBinaryFile } = useContext(ProfileLoaderContext);
  const [calculatorData, setCalculatorData] = useState(null);

  useEffect(() => {
    // Load the file when the component mounts
    fetchBinaryFile(EXAMPLE_A7P);
  }, [EXAMPLE_A7P]);

  useEffect(() => {
    if (fileContent) {
      const preparedCalculator = prepareCalculator(fileContent);
      setCalculatorData(preparedCalculator);
    }
  }, [fileContent]);

  return (
      (fileContent && calculatorData) ? (
        <View style={styles.container}>
          <TrajectoryTable calculatorData={calculatorData} />
          <TrajectoryChart calculatorData={calculatorData} />
        </View>
      ) : (
        <Text>No data available</Text>
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