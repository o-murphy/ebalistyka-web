import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import FileLoader from './src/components/trajectoryData';
import { ProfileLoaderProvider } from './src/providers/profileLoaderProvider';
import FileDrop from './src/components/dndField';
import DoubleSpinBox from './src/components/doubleSpinBox';
import { TextInput, PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
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
            <DoubleSpinBox right={<TextInput.Affix text="Inch" />}/>
            {/* <FileDrop /> */}
            {/* <FileLoader EXAMPLE_A7P={EXAMPLE_A7P} PROTO_URL={PROTO_URL} /> */}
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
