import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Svg, Circle, Text } from 'react-native-svg';
import HT5 from '../../../../../assets/HT5'; // Your base SVG
import { useProfile, usePreferredUnits } from '../../../../context';
import { TrajectoryData, UNew, Unit } from 'js-ballistics/dist/v2';
import { useTheme } from 'react-native-paper';


interface ReticleProps {
    trajectory: TrajectoryData[] | any[];
    step?: number;
}


export const Reticle: React.FC<ReticleProps> = ({ trajectory, step = 100 }) => {

    const Mil1 = 20

    const { currentConditions } = useProfile()
    const { preferredUnits } = usePreferredUnits()
    const theme = useTheme()

    const trajStep = parseFloat((UNew.Meter(currentConditions.trajectoryStep).In(preferredUnits.distance) / 10).toFixed(0)) * 10
    const filterValues = (value) => {
        const numericValue = parseFloat(value.distance.In(preferredUnits.distance).toFixed(0))
        return numericValue % step === 0
    }

    const preparedData = trajectory.filter(filterValues).map((value) => {
        return {
            cx: value.windageAdjustment.In(Unit.MIL) * Mil1,
            cy: value.dropAdjustment.In(Unit.MIL) * Mil1,
            dst: value.distance.In(preferredUnits.distance).toFixed(0),
        }
    })

    return (
        <View style={[styles.container,]}>
            {/* Base SVG Component */}
            <HT5 style={styles.svg} color={theme.colors.onSurface} viewBox="-160 -80 320 320" />

            {/* Custom SVG Elements */}
            {<Svg style={styles.svgOverlay} viewBox="-160 -80 320 320">

                {/* {preparedData && preparedData.map((point, index) => <Cross point={point} index={index}/>)} */}
                {preparedData && preparedData.map((point, index) => <Circle key={index} cx={point.cx} cy={-point.cy} r="3" strokeWidth="0" fill="red" />)}

                {preparedData && preparedData.map((point, index) => <Text
                    key={index}
                    x={point.cx - 20}
                    y={-point.cy}
                    strokeWidth="1"
                    stroke="red"
                    style={{ fontSize: 6, }}
                    textAnchor="end"
                >{point.dst}</Text>)}

            </Svg>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'gray', // To visually check the container
        maxWidth: 480, // Container width
        // height: 640, // Container height
        aspectRatio: 1,
        position: 'relative', // Necessary for absolute positioning of child elements
        alignSelf: "center"
    },
    svg: {
        position: 'relative', // Stack the base SVG
        top: 0,
        left: 0,
        width: '100%',
        // height: 640,
        aspectRatio: 1
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
