import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Svg, Circle, Line, Rect } from 'react-native-svg';
import HorusTremor5 from '../../../../../assets/HorusTremor5'; // Your base SVG
import { useProfile } from '../../../../context/profileContext';
import { Unit } from 'js-ballistics/dist/v2';
import { useTheme } from '../../../../context/themeContext';
import { usePreferredUnits } from '../../../../context/preferredUnitsContext';
import { UNew } from 'js-ballistics';

export const Reticle = () => {

    const Mil1 = 20

    const { hitResult, currentConditions } = useProfile()
    const { theme } = useTheme()
    const { preferredUnits } = usePreferredUnits()

    const isError = hitResult instanceof Error

    const trajStep = parseFloat((UNew.Meter(currentConditions.trajectoryStep).In(preferredUnits.distance) / 10).toFixed(0)) * 10
    const filterValues = (value) => {
        return parseFloat(value.distance.In(preferredUnits.distance).toFixed(0)) % trajStep === 0
    }

    return (
        <View style={[styles.container, ]}>
            {/* Base SVG Component */}
            <HorusTremor5 style={styles.svg} color={theme.colors.onSurface} viewBox="-160 -80 320 320"/>

            {/* Custom SVG Elements */}
            {!isError && <Svg style={styles.svgOverlay} viewBox="-160 -80 320 320">
                {/* Add dynamic elements here */}
                {/* <Rect x="-320" y="-320" width="640" height="640" fill="transparent" />
                <Circle cx="0" cy="0" r="50" stroke="blue" strokeWidth="1" fill="none" /> */}
                {/* <Line x1="-300" y1="0" x2="300" y2="0" stroke="red" strokeWidth="1" />
                <Line x1="0" y1="-300" x2="0" y2="300" stroke="red" strokeWidth="1" /> */}

                {/* <Circle cx={0} cy={Mil1} r="3" stroke="blue" strokeWidth="0" fill="red" /> */}

                {!isError && hitResult?.trajectory?.filter(filterValues).map((value) => {
                    const cx = value.windageAdjustment.In(Unit.MIL) * Mil1
                    const cy = value.dropAdjustment.In(Unit.MIL) * Mil1
                    return <Circle cx={-cx} cy={-cy} r="1" strokeWidth="0" fill="red" />
                })}

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
        maxWidth: 640, // Container width
        // height: 640, // Container height
        position: 'relative', // Necessary for absolute positioning of child elements
        alignSelf: "center"
    },
    svg: {
        position: 'relative', // Stack the base SVG
        top: 0,
        left: 0,
        width: '100%',
        // height: '100%',
    },
    svgOverlay: {
        position: 'absolute', // Stack the overlay SVG
        top: 0,
        left: 0,
        width: '100%',
        // height: '100%',
    },
});
