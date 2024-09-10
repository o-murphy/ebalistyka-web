import { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProfileLoaderContext } from '../providers/profileLoaderProvider'; // Path to where you created the context
import { prepareCalculator } from '../utils/prepareCalculator';
import TrajectoryChart from './trajectoryChart';
import TrajectoryTable from './trajectoryTable';
import {
  preferredUnits, Unit
} from 'js-ballistics/dist/v2';

preferredUnits.distance = Unit.Meter
preferredUnits.velocity = Unit.MPS
preferredUnits.angular = Unit.Degree
preferredUnits.adjustment = Unit.MIL
preferredUnits.drop = Unit.Centimeter

export default function FileLoader({ EXAMPLE_A7P, PROTO_URL }) {
  const { fileContent, fetchBinaryFile, isChecksumValid } = useContext(ProfileLoaderContext);
  const [calculatorData, setCalculatorData] = useState(null);

  useEffect(() => {
    // Load the file when the component mounts
    fetchBinaryFile(EXAMPLE_A7P, PROTO_URL);
  }, [EXAMPLE_A7P, PROTO_URL]);

  useEffect(() => {
    if (fileContent) {
      const preparedCalculator = prepareCalculator(fileContent);
      setCalculatorData(preparedCalculator);
    }
  }, [fileContent]);

  return (
    <View style={styles.container}>
      {(fileContent && calculatorData) ? (
        <View>
          <TrajectoryTable calculatorData={calculatorData} />
          <TrajectoryChart calculatorData={calculatorData} />
        </View>
      ) : (
        <Text>No data available</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});