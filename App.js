import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import TrajectoryData from './src/components/widgets/trajectoryData';
import { ProfileProvider } from './src/providers/profileLoaderProvider';
import A7PFileUploader from './src/components/widgets/fileDrop';
import { Appbar, PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import WeaponCard from './src/components/cards/weaponCard';
import ProjectileCard from './src/components/cards/projectileCard';
import BulletCard from './src/components/cards/bulletCard';
import AtmoCard from './src/components/cards/atmoCard';
import WindCard from './src/components/cards/windCard';
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
      <PaperProvider theme={theme} >

        <ProfileProvider>

          <Appbar.Header mode={"center-aligned"} style={{
            height: 48,
            backgroundColor: theme.colors.elevation.level2
          }}>

            <Appbar.Content title="E-Balistyka" />
            <A7PFileUploader />

          </Appbar.Header>


          <View style={{ ...styles.row }}>

            <ScrollView
              style={{ ...styles.column, flex: 1, minWidth: 280, }}
              keyboardShouldPersistTaps="always"
              alwaysBounceVertical={false}
              showsVerticalScrollIndicator={false}
            >
              <WeaponCard expanded={true} />
              <ProjectileCard expanded={true} />
              <BulletCard expanded={true} />
            </ScrollView>

            <ScrollView style={{ ...styles.column, flex: 3, minWidth: 600, }}
              keyboardShouldPersistTaps="always"
              alwaysBounceVertical={false}
              showsVerticalScrollIndicator={false}
            >
              <TrajectoryData EXAMPLE_A7P={EXAMPLE_A7P} />
            </ScrollView>

            <ScrollView
              style={{ ...styles.column, flex: 1, minWidth: 280 }}
              keyboardShouldPersistTaps="always"
              alwaysBounceVertical={false}
              showsVerticalScrollIndicator={false}
            >
              <AtmoCard expanded={false} />
              <WindCard expanded={false} />
              <AtmoCard expanded={true} label='Current atmosphere' />
              <WindCard expanded={true} label='Current wind' />

            </ScrollView>

          </View>
        </ProfileProvider>

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
    flexDirection: "column",
  }
});
