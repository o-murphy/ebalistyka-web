import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import TrajectoryData from './src/components/widgets/trajectoryData';
import { ProfileLoaderProvider } from './src/providers/profileLoaderProvider';
import A7PFileUploader from './src/components/widgets/fileDrop';
import DoubleSpinBox from './src/components/widgets/doubleSpinBox';
import { TextInput, PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import WeaponCard from './src/components/cards/weaponCard';
// import { isMobile } from 'react-device-detect';

const PROTO_URL = '/src/proto/profedit.proto'; // Adjust the path to your .proto file
const EXAMPLE_A7P = '/assets/example.a7p'

export default function App() {

  const [nightMode, setNightMode] = useState(true);
  const theme = nightMode ? MD3DarkTheme : MD3LightTheme

  const toggleNightMode = () => {
    setNightMode((prevNightMode) => !prevNightMode);
  };

  const styles = {
    provider: {
      flex: 1,
      backgroundColor: theme.colors.background  // Theme Background Color
    },
  }

  return (
    <SafeAreaProvider style={styles.provider}>
      <PaperProvider theme={theme}>

        <ProfileLoaderProvider>
          <View style={styles.container}>
            {/* <DoubleSpinBox right={<TextInput.Affix text="Inch" />}/> */}
            <A7PFileUploader />
            <WeaponCard />
            <TrajectoryData EXAMPLE_A7P={EXAMPLE_A7P} />
            {/* <StatusBar style="auto" /> */}
          </View>
        </ProfileLoaderProvider>

      </PaperProvider>
    </SafeAreaProvider>
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
