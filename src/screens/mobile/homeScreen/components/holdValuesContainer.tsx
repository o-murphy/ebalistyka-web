import { Angular, Unit, UnitProps } from "js-ballistics/dist/v2"
import { useState } from "react"
import { StyleSheet, View } from "react-native"
import { Divider, Icon, Text, useTheme } from "react-native-paper"

const holdUnits = [
    Unit.MRad,
    Unit.MOA,
    Unit.MIL,
    Unit.CmPer100M,
    Unit.InchesPer100Yd
]


const HoldAsText = ({ value, unit, style }) => {
    const text = value && `${value.In(unit).toFixed(UnitProps[unit].accuracy)} ${UnitProps[unit].symbol}`
    return <Text style={style}>{text}</Text>

}

const HoldValues = ({ value, icon, color, layoutSize }) => {
    const holdFontSize = Math.min(layoutSize.width, layoutSize.height) / 11
    const holdTextStyle = { color: color, textAlign: "left", fontSize: holdFontSize }

    return (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon size={2 * holdFontSize} color={color} source={icon} />
            <View style={{ width: layoutSize.width - 3 * holdFontSize }}>
                {holdUnits.map((unit, index) => <HoldAsText key={`${index}`} style={holdTextStyle} value={value} unit={unit} />)}
            </View>
        </View>
    )
}

export const HoldValuesContainer = ({ hold }: { hold: { hold: Angular, wind: Angular } }) => {
    const theme = useTheme()
    const [holdLayoutSize, setHoldLayoutSize] = useState({ width: 0, height: 0 }); // Default value

    const onHoldLayout = (event) => {
        const { width, height } = event.nativeEvent.layout;
        setHoldLayoutSize({ width, height })
    }

    return (
        <View style={[styles.shotResultHoldContainer, { backgroundColor: theme.colors.onSecondary }]} onLayout={onHoldLayout}>
            <HoldValues icon={"arrow-expand-vertical"} value={hold?.hold} color={theme.colors.secondary} layoutSize={holdLayoutSize} />
            <Divider bold style={{ height: 1, width: "80%", backgroundColor: theme.colors.secondary }} />
            <HoldValues icon={"arrow-expand-horizontal"} value={hold?.wind} color={theme.colors.secondary} layoutSize={holdLayoutSize} />
        </View>
    )
}


const styles = StyleSheet.create({
    shotResultHoldContainer: {
        width: "40%",
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "space-around",
    },
});