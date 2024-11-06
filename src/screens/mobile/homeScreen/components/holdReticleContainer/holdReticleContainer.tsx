import React from 'react';
import { Angular } from "js-ballistics/dist/v2";
import { StyleSheet, View } from "react-native";
import HT5 from '../../../../../../assets/HT5'; // Your base SVG
import { useTheme } from "react-native-paper";

interface Hold {
  hold: Angular;
  wind: Angular;
}

const HoldReticleContainer: React.FC<{ hold: Hold }> = ({ hold }) => {
  const theme = useTheme();

  return (
    <View style={[styles.shotResultReticleContainer, { backgroundColor: theme.colors.elevation.level1 }]}>
      <HT5
        style={styles.reticleSVG}
        color={theme.colors.onSurface}
        viewBox="-80 -40 160 160" // You could parameterize this if needed
      />
    </View>
  );
};

const styles = StyleSheet.create({
  shotResultReticleContainer: {
    aspectRatio: 1,
    width: "55%",
    borderRadius: 32,
    overflow: "hidden",
  },
  reticleSVG: {
    flex: 1,
    width: "100%",
  },
});

export default React.memo(HoldReticleContainer);
