import React, { useState, useCallback } from 'react';
import { Angular, Unit, UnitProps } from "js-ballistics/dist/v2";
import { StyleSheet, View } from "react-native";
import { Divider, Icon, Text, useTheme } from "react-native-paper";

const holdUnits = [
    Unit.MRad,
    Unit.MOA,
    Unit.MIL,
    Unit.CmPer100M,
    Unit.InchesPer100Yd
];

interface HoldValuesProps {
    value: Angular;
    icon: string;
    color: string;
    layoutSize: { width: number; height: number };
}

const HoldAsText: React.FC<{ value: Angular; unit: Unit; style: object }> = React.memo(({ value, unit, style }) => {
    const text = value ? `${value.In(unit).toFixed(UnitProps[unit].accuracy)} ${UnitProps[unit].symbol}` : '';
    return <Text style={style}>{text}</Text>;
});

const HoldValues: React.FC<HoldValuesProps> = React.memo(({ value, icon, color, layoutSize }) => {
    const holdFontSize = Math.min(layoutSize.width, layoutSize.height) / 11;
    const holdTextStyle = { color, textAlign: "left", fontSize: holdFontSize };

    return (
        <View style={styles.rowContainer}>
            <Icon size={2 * holdFontSize} color={color} source={icon} />
            <View style={{ width: layoutSize.width - 3 * holdFontSize }}>
                {holdUnits.map((unit, index) => (
                    <HoldAsText key={index} style={holdTextStyle} value={value} unit={unit} />
                ))}
            </View>
        </View>
    );
});

interface HoldValuesContainerProps {
    hold: { hold: Angular; wind: Angular };
}

const HoldValuesContainer: React.FC<HoldValuesContainerProps> = ({ hold }) => {
    const theme = useTheme();
    const [holdLayoutSize, setHoldLayoutSize] = useState({ width: 0, height: 0 });

    const onHoldLayout = useCallback((event) => {
        const { width, height } = event.nativeEvent.layout;
        setHoldLayoutSize({ width, height });
    }, []);

    return (
        <View style={[styles.shotResultHoldContainer, { backgroundColor: theme.colors.elevation.level1 }]} onLayout={onHoldLayout}>
            <HoldValues icon="arrow-expand-vertical" value={hold?.hold} color={theme.colors.onSurface} layoutSize={holdLayoutSize} />
            <Divider bold style={[styles.divider, { backgroundColor: theme.colors.outlineVariant }]} />
            <HoldValues icon="arrow-expand-horizontal" value={hold?.wind} color={theme.colors.onSurface} layoutSize={holdLayoutSize} />
        </View>
    );
};

const styles = StyleSheet.create({
    shotResultHoldContainer: {
        width: "40%",
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "space-around",
    },
    rowContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    divider: {
        height: 1,
        width: "80%",
    },
});

export default React.memo(HoldValuesContainer);