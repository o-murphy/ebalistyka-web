import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import FileLoader from './src/components/trajectoryData';
import { ProfileLoaderProvider } from './src/providers/profileLoaderProvider';
import FileDrop from './src/components/dndField';
import DoubleSpinBox from './src/components/doubleSpinBox';

const PROTO_URL = '/src/proto/profedit.proto'; // Adjust the path to your .proto file
const EXAMPLE_A7P = '/assets/example.a7p'

export default function App() {
  return (
    <ProfileLoaderProvider>
      <View style={styles.container}>
        {/* <Text>Open up App.js to start working on your app!</Text> */}
        <DoubleSpinBox />
        <FileDrop />
        <FileLoader EXAMPLE_A7P={EXAMPLE_A7P} PROTO_URL={PROTO_URL} />
        <StatusBar style="auto" />
      </View>
    </ProfileLoaderProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
