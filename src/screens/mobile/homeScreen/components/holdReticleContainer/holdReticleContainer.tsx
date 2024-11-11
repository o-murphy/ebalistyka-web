import React from 'react';
import { Angular, HitResult, preferredUnits, TrajectoryData, Unit } from "js-ballistics/dist/v2";
import { StyleSheet, View } from "react-native";
import HT5 from '../../../../../../assets/HT5'; // Your base SVG
import { Chip, Surface, Text, useTheme } from "react-native-paper";
import { useCalculator } from '../../../../../context/profileContext';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import { usePreferredUnits } from '../../../../../context/preferredUnitsContext';


interface Hold {
  hold: Angular;
  wind: Angular;
}

const HoldReticleContainer: React.FC<{ hold: Hold }> = ({ hold }) => {
  const theme = useTheme();
  const { adjustedResult } = useCalculator()
  const { preferredUnits } = usePreferredUnits()

  // const viewBox="-160 -80 320 320"
  const viewBox = [-160, -80, 320, 320]
  const Mil1 = 20

  const AdjustmentPoint = () => {
    if (adjustedResult instanceof HitResult) {
      const hold = adjustedResult.shot.relativeAngle
      const trajectory: TrajectoryData[] = [...adjustedResult?.trajectory]
      const holdRow = trajectory.slice(1).reduce((closest, item) => Math.abs(item.dropAdjustment.rawValue) < Math.abs(closest.dropAdjustment.rawValue) ? item : closest, trajectory[1]);
      const point = {
        cx: holdRow.windageAdjustment.In(Unit.MIL) * Mil1,
        cy: - hold.In(Unit.MIL) * Mil1,
        desc: holdRow.distance.In(preferredUnits.distance).toFixed(0)
      }

      const isOutOfScope = -point.cy >= viewBox[1] + viewBox[3]
      // console.log(-point.cy, viewBox[1] + viewBox[3], isOutOfScope)

      if (isOutOfScope) {
        return (
          <View style={{ position: "absolute", width: '100%', top: "45%", alignItems: "center", justifyContent: "center"}}>
            <Chip
              textStyle={{ textAlign: "center", color: theme.colors.onErrorContainer, alignItems: "center" }}
              style={{ backgroundColor: theme.colors.errorContainer  }}>
              {"OUT OF SCOPE"}
            </Chip>

          </View>
        )
      }

      return (
        <Svg style={styles.svgOverlay} viewBox={viewBox}>
          <Circle cx={point.cx} cy={-point.cy} r="5" strokeWidth="0" fill={theme.colors.onErrorContainer} />

          <SvgText
            x={point.cx - 20}
            y={-point.cy + 10}
            strokeWidth="1"
            fill={theme.colors.onErrorContainer}
            style={{ fontSize: 30, fontFamily: 'Roboto', fontWeight: "bold" }}
            textAnchor="end"
          >{point.desc}
          </SvgText>
        </Svg>
      )
    }
  }

  return (
    <Surface mode={"flat"} style={styles.shotResultReticleContainer} elevation={2}>
      <HT5
        style={styles.reticleSVG}
        color={theme.colors.onSurface}
        viewBox={viewBox} // You could parameterize this if needed
      />
      <AdjustmentPoint />
    </Surface>
  );
};

// const styles = StyleSheet.create({
//   container: {
//       flex: 1,
//       justifyContent: 'center',
//       alignItems: 'center',
//       // backgroundColor: 'gray', // To visually check the container
//       maxWidth: 480, // Container width
//       // height: 640, // Container height
//       aspectRatio: 1,
//       position: 'relative', // Necessary for absolute positioning of child elements
//       alignSelf: "center"
//   },
//   svg: {
//       position: 'relative', // Stack the base SVG
//       top: 0,
//       left: 0,
//       width: '100%',
//       // height: 640,
//       aspectRatio: 1
//   },
//   svgOverlay: {
//       position: 'absolute', // Stack the overlay SVG
//       top: 0,
//       left: 0,
//       width: '100%',
//       // height: 640,
//       aspectRatio: 1
//   },
// });

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
  svgOverlay: {
    position: 'absolute', // Stack the overlay SVG
    top: 0,
    left: 0,
    width: '100%',
    // height: 640,
    aspectRatio: 1
  },
});

export default React.memo(HoldReticleContainer);
