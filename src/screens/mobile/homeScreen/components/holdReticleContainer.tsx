import { Angular } from "js-ballistics/dist/v2"
import { StyleSheet, View } from "react-native"
import HT5 from '../../../../../assets/HT5'; // Your base SVG
import { useTheme } from "react-native-paper";

export const HoldReticleContainer = ({ hold }: { hold: { hold: Angular, wind: Angular } }) => {
    const theme = useTheme()

    return (
        <View style={[styles.shotResultReticleContainer, { backgroundColor: theme.colors.onSecondary }]}>
            <HT5 style={{ flex: 1, width: "100%" }} color={theme.colors.secondary} viewBox="-80 -40 160 160" />
        </View>
    )
}

const styles = StyleSheet.create({
    shotResultReticleContainer: {
        aspectRatio: 1,
        width: "55%",
        borderRadius: 32,
        overflow: "hidden"
    },
});