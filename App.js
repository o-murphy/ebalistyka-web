import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View } from 'react-native';
import TrajectoryData from './src/components/widgets/trajectoryData';
import { ProfileLoaderProvider } from './src/providers/profileLoaderProvider';
import A7PFileUploader from './src/components/widgets/fileDrop';
import { Text, PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import WeaponCard from './src/components/cards/weaponCard';
import InputCard from './src/components/cards/inputCard';
import ProjectileCard from './src/components/cards/projectileCard';
import BulletCard from './src/components/cards/bulletCard';
// import { isMobile } from 'react-device-detect';

const PROTO_URL = '/src/proto/profedit.proto'; // Adjust the path to your .proto file
const EXAMPLE_A7P = '/assets/example.a7p'

export default function App() {

  const [nightMode, setNightMode] = useState(true);
  const theme = nightMode ? MD3DarkTheme : MD3LightTheme

  const toggleNightMode = () => {
    setNightMode((prevNightMode) => !prevNightMode);
  };

  const themeStyles = {
    provider: {
      flex: 1,
      backgroundColor: theme.colors.background  // Theme Background Color
    },
  }

  return (
    <SafeAreaProvider style={themeStyles.provider}>
      <PaperProvider theme={theme}>

        <ProfileLoaderProvider>
          <View style={styles.row}>
            {/* <DoubleSpinBox right={<TextInput.Affix text="Inch" />}/> */}

            <ScrollView
              style={{ ...styles.column, flex: 1, minWidth: 400 }}
              keyboardShouldPersistTaps="always"
              alwaysBounceVertical={false}
              showsVerticalScrollIndicator={false}
            >
              <InputCard title={"Open ballistic profile"}>
                <A7PFileUploader />
              </InputCard>
              <WeaponCard />
              <ProjectileCard />
              <BulletCard />
            </ScrollView>

            <ScrollView style={{ ...styles.column, flex: 4, minWidth: 640, }}
              keyboardShouldPersistTaps="always"
              alwaysBounceVertical={false}
              showsVerticalScrollIndicator={false}
            >
              <TrajectoryData EXAMPLE_A7P={EXAMPLE_A7P} />
            </ScrollView>
            
            <ScrollView
              style={{ ...styles.column, flex: 1, minWidth: 400 }}
              keyboardShouldPersistTaps="always"
              alwaysBounceVertical={false}
              showsVerticalScrollIndicator={false}
            >
                <Text variant="headlineLarge" style={{alignSelf: "center"}}>Placeholder</Text>
              {/* <InputCard title={"Open ballistic profile"}>
                <A7PFileUploader />
              </InputCard>
              <WeaponCard />
              <ProjectileCard />
              <BulletCard /> */}
            </ScrollView>

            {/* <StatusBar style="auto" /> */}
          </View>
        </ProfileLoaderProvider>

      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: "row",
  },
  column: {
    flex: 1,
    flexDirection: "column"
  }
});
