import { StyleSheet, View } from "react-native"
import { Divider, Icon, Text } from "react-native-paper"
import { useCalculator } from "../../../../context/profileContext"
import { useEffect } from "react"
import { useTheme } from "../../../../context/themeContext";
import HorusTremor5 from '../../../../../assets/HorusTremor5'; // Your base SVG



export const BotContainer = () => {
    const { profileProperties, adjustedResult, isLoaded, fire } = useCalculator()
    const { theme } = useTheme()

    useEffect(() => {
        fire()
    }, [isLoaded])


    const shortInfo = [
        `${(profileProperties?.bWeight / 10).toFixed(1)} gr.`,
        `${profileProperties?.bulletName}`,
        `${(profileProperties?.cMuzzleVelocity / 10).toFixed(0)} m/s`,
        `${profileProperties?.bcType}: ${(profileProperties?.coefRows?.[0].bcCd / 10000).toFixed(3)}`,
    ]

    return (
        <View style={styles.botContainer}>
            <Text style={styles.shortInfo} variant="labelMedium">
                {profileProperties && shortInfo.join('; ')}
            </Text>
            <View style={styles.shotResultContainer}>
                <View style={styles.shotResultReticleContainer}>
                    <HorusTremor5 style={{flex: 1, width: "100%"}} color={theme.colors.onPrimary} viewBox="-80 -40 160 160" />
                </View>


                <View style={styles.shotResultHoldContainer}>
                    <View style={{ flexDirection: "row", alignItems: "center"  }}>
                        <Icon size={28} color={theme.colors.onPrimary} source={"arrow-up"} />
                        <View>
                            <Text style={{ color: theme.colors.onPrimary, textAlign: "left", }} variant={"labelLarge"} >5.20 MRAD</Text>
                            <Text style={{ color: theme.colors.onPrimary, textAlign: "left", }} variant={"labelLarge"} >17.88 MOA</Text>
                            <Text style={{ color: theme.colors.onPrimary, textAlign: "left", }} variant={"labelLarge"} >5.20 MIL</Text>
                            <Text style={{ color: theme.colors.onPrimary, textAlign: "left", }} variant={"labelMedium"} >52.0 cm/100m</Text>
                        </View>
                    </View>

                    <Divider bold style={{ height: 2, width: "80%", backgroundColor: theme.colors.onPrimary }} />

                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Icon size={28} color={theme.colors.onPrimary} source={"arrow-left"} />
                        <View>
                            <Text style={{ color: theme.colors.onPrimary, textAlign: "left", }} variant={"labelLarge"} >0.14 MRAD</Text>
                            <Text style={{ color: theme.colors.onPrimary, textAlign: "left", }} variant={"labelLarge"} >0.48 MOA</Text>
                            <Text style={{ color: theme.colors.onPrimary, textAlign: "left", }} variant={"labelLarge"} >0.14 MIL</Text>
                            <Text style={{ color: theme.colors.onPrimary, textAlign: "left", }} variant={"labelMedium"} >1.4 cm/100m</Text>
                        </View>
                    </View>

                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    botContainer: { flexDirection: "column", padding: 8 },
    shortInfo: { textAlign: "center" },
    shotResultContainer: { flexDirection: "row", marginBottom: 64, padding: 16, justifyContent: "space-between" },
    shotResultReticleContainer: { 
        aspectRatio: 1, 
        width: "55%", 
        borderRadius: 32, 
        backgroundColor: "white",
        overflow: "hidden" 
    },
    shotResultHoldContainer: {
        width: "40%",
        borderRadius: 16,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
    },
});