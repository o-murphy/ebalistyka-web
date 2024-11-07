import React, { useState, useCallback } from 'react';
import { Angular, Unit, UnitProps } from "js-ballistics/dist/v2";
import { StyleSheet } from "react-native";
import { Divider, Icon, Surface, Text } from "react-native-paper";

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
    layoutSize: { width: number; height: number };
}

const HoldAsText: React.FC<{ value: Angular; unit: Unit; style: object }> = React.memo(({ value, unit, style }) => {
    const text = value ? `${value.In(unit).toFixed(UnitProps[unit].accuracy)} ${UnitProps[unit].symbol}` : '';
    return <Text style={style}>{text}</Text>;
});

const HoldValues: React.FC<HoldValuesProps> = React.memo(({ value, icon, layoutSize }) => {
    const holdFontSize = Math.min(layoutSize.width, layoutSize.height) / 11;
    const holdTextStyle = { textAlign: "left", fontSize: holdFontSize };

    return (
        <Surface style={styles.rowContainer} elevation={0}>
            <Icon size={2 * holdFontSize} source={icon} />
            <Surface style={{ width: layoutSize.width - 3 * holdFontSize, paddingLeft: 4 }} elevation={0}>
                {holdUnits.map((unit, index) => (
                    <HoldAsText key={index} style={holdTextStyle} value={value} unit={unit} />
                ))}
            </Surface>
        </Surface>
    );
});

interface HoldValuesContainerProps {
    hold: { hold: Angular; wind: Angular };
}

const HoldValuesContainer: React.FC<HoldValuesContainerProps> = ({ hold }) => {
    const [holdLayoutSize, setHoldLayoutSize] = useState({ width: 0, height: 0 });

    const onHoldLayout = useCallback((event) => {
        const { width, height } = event.nativeEvent.layout;
        setHoldLayoutSize({ width, height });
    }, []);

    return (
        <Surface mode={"flat"} style={[styles.shotResultHoldContainer]} elevation={2} onLayout={onHoldLayout}>
            <HoldValues icon="arrow-expand-vertical" value={hold?.hold} layoutSize={holdLayoutSize} />
            <Divider bold style={[styles.divider]} />
            <HoldValues icon="arrow-expand-horizontal" value={hold?.wind} layoutSize={holdLayoutSize} />
        </Surface>
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
        justifyContent: "space-between",
    },
    divider: {
        height: 1,
        width: "80%",
    },
});

export default React.memo(HoldValuesContainer);