import { StyleSheet } from "react-native";
import { Chip, FAB, Surface, Switch, Text } from "react-native-paper";
import { useEffect, useState } from "react";
import { ScreenBackground, ScrollViewSurface } from "../components";
import { useCalculator } from "../../../context/profileContext";
import { WeatherHumidityDialog, WeatherPressureDialog, WeatherTemperatureDialog } from "./components";
import { HitResult, UNew } from "js-ballistics/dist/v2";
import { usePreferredUnits } from "../../../context/preferredUnitsContext";
import { UnitProps } from "js-ballistics";


const WeatherContent = () => {

    const { currentConditions, updateCurrentConditions, adjustedResult, profileProperties } = useCalculator()
    const { preferredUnits } = usePreferredUnits()
    const [usePowderSens, setUsePowderSens] = useState<boolean>(currentConditions.usePowderSens);

    useEffect(() => {
        updateCurrentConditions({
            usePowderSens: usePowderSens
        })
    }, [usePowderSens])

    const onTogglePowderSens = () => {
        console.log(!usePowderSens)
        setUsePowderSens(!usePowderSens);
    }

    const CurrentVelocity = () => {
        if (adjustedResult instanceof HitResult) {
            const currentTemp = UNew.Celsius(currentConditions.temperature).In(preferredUnits.temperature).toFixed(0)
            const currentTempSymbol = UnitProps[preferredUnits.temperature].symbol
            const currentMuzzleVelocity = adjustedResult.trajectory[0].velocity.In(preferredUnits.velocity).toFixed(0)
            const velocitySymbol = UnitProps[preferredUnits.velocity].symbol
            return (
                <Surface style={styles.powderSenseSwitchRow} elevation={0}>
                    <Text style={{ flex: 3 }}>
                        Muzzle velocity for {currentTemp} {currentTempSymbol}
                    </Text>
                    <Chip style={{ flex: 2 }}>
                        {currentMuzzleVelocity} {velocitySymbol}
                    </Chip>
                </Surface>
            )
        }
    }

    const PowderSense = () => {
        if (adjustedResult instanceof HitResult) {
            return (
                <Surface style={styles.powderSenseSwitchRow} elevation={0}>
                    <Text style={{ flex: 3 }}>
                        Powder sensitivity
                    </Text>
                    <Chip style={{ flex: 2 }}>
                        {(profileProperties.cTCoeff / 1000).toFixed(2)} %/15°C
                    </Chip>
                </Surface>
            )
        }
    }


    return (
        <ScrollViewSurface
            style={styles.scrollView}
            keyboardShouldPersistTaps="always"
            alwaysBounceVertical={false}
            showsVerticalScrollIndicator={true}
            elevation={1}
            surfaceStyle={styles.scrollViewContainer}
        >

            <Surface elevation={0} style={styles.innerContainer}>
                <Surface style={styles.fabButtonsRow} elevation={0}>

                    <WeatherTemperatureDialog button={
                        <FAB
                            size="small"
                            icon={"thermometer"}
                            onPress={() => console.log('cTemp')}
                            label={"15 deg"}
                            style={styles.fabStyle}
                        />
                    } />
                    <WeatherHumidityDialog button={
                        <FAB
                            size="small"
                            icon={"water"}
                            onPress={() => console.log('Wind')}
                            label={"50 %"}
                            style={styles.fabStyle}
                        />
                    } />
                    <WeatherPressureDialog button={
                        <FAB
                            size="small"
                            icon={"gauge"}
                            onPress={() => console.log('Pressure')}
                            label={"1000 hPa"}
                            style={styles.fabStyle}
                        />
                    } />

                </Surface>

                <Surface style={styles.powderSenseSwitchRow} elevation={0}>
                    <Text>Use powder sensitivity</Text>
                    <Switch
                        value={usePowderSens}
                        onValueChange={onTogglePowderSens}
                    />
                </Surface>

                {usePowderSens && <CurrentVelocity />}
                {usePowderSens && <PowderSense />}

            </Surface>


        </ScrollViewSurface>
    )
}


const WeatherScreen = ({ navigation }) => {
    return (
        <ScreenBackground>
            <WeatherContent />
        </ScreenBackground>
    )
}


const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        paddingBottom: 32,
    },
    scrollViewContainer: {
        paddingBottom: 16,
        borderBottomRightRadius: 16,
        borderBottomLeftRadius: 16,
    },
    fabContainer: {
        paddingHorizontal: 16,
        paddingBottom: 8,
        flexDirection: "row",
        justifyContent: "center", // Use space-between to avoid overlap
        alignItems: "center",
    },
    fabStyle: {
        flex: 1, // Allow each FAB to grow equally
        marginHorizontal: 4,
        marginVertical: 4,
        textAlign: "center",
    },
    innerContainer: {
        marginHorizontal: 16
    },
    fabButtonsRow: {
        flexDirection: "row",
        marginVertical: 8
    },
    powderSenseSwitchRow: {
        marginHorizontal: 16,
        marginVertical: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
});


export default WeatherScreen;