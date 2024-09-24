import { View, StyleSheet } from 'react-native';
import { useProfile } from '../../context/profileContext'; // Path to where you created the context
import TrajectoryChart from './trajectoryChart';
import TrajectoryTable from './trajectoryTable';
import {
  preferredUnits, Unit
} from 'js-ballistics/dist/v2';
import A7PFileUploader from './fileDrop';
import WindageChart from './windageChart';

preferredUnits.distance = Unit.Meter
preferredUnits.velocity = Unit.MPS
preferredUnits.angular = Unit.Degree
preferredUnits.adjustment = Unit.MIL
preferredUnits.drop = Unit.Centimeter

export default function TrajectoryData() {
  const { calculator, profileProperties } = useProfile();

  return (
    (profileProperties && calculator) ? (
      <View style={styles.container}>
        <TrajectoryTable />
        <TrajectoryChart />
        <WindageChart />
      </View>
    ) : (
      <View style={[styles.container, { padding: 15 }]}>
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