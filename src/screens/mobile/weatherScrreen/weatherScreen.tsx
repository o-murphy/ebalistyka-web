import { StyleSheet } from "react-native";
import { Button, Chip, FAB, Surface, Switch, Text } from "react-native-paper";
import { ScreenBackground, ScrollViewSurface } from "../components";
import { useCalculator } from "../../../context/profileContext";
import { WeatherHumidityDialog, WeatherPowderTemperatureDialog, WeatherPressureDialog, WeatherTemperatureDialog } from "./components";
import { HitResult, Unit, Velocity } from "js-ballistics/dist/v2";
import { useCurrentConditions } from "../../../context/currentConditions";
import { useDimension } from "../../../hooks/dimension";
import { useEffect } from "react";



const CurrentVelocity = () => {
    const { adjustedResult } = useCalculator()
    const { temperature, powderTemperature, currentConditions } = useCurrentConditions()
    const { useDifferentPowderTemperature } = currentConditions
    // NOTE: temporary 
    const muzzleVelocity = useDimension({
        measure: Velocity,
        defUnit: Unit.MPS,
        prefUnitFlag: "velocity",
        min: 0,
        max: 3000,
        precision: 1
    })

    useEffect(() => {
        if (adjustedResult instanceof HitResult) {
            muzzleVelocity.setValue(adjustedResult.trajectory[0].velocity)
        }
    }, [adjustedResult])


    if (adjustedResult instanceof HitResult) {
        const currentTemp = (useDifferentPowderTemperature ? powderTemperature : temperature).asString
        const currentTempSymbol = powderTemperature.symbol

        const currentMuzzleVelocity = muzzleVelocity.asString
        const velocitySymbol = muzzleVelocity.symbol
        return (
            <Surface style={styles.powderSenseSwitchRow} elevation={0}>
                <Text style={{ flex: 3 }}>
                    {`Muzzle velocity for ${currentTemp} ${currentTempSymbol} of powder temperature`}
                </Text>
                <Chip style={{ flex: 2 }} disabled>
                    {currentMuzzleVelocity} {velocitySymbol}
                </Chip>
            </Surface>
        )
    }
}

const PowderSense = () => {
    const { profileProperties, adjustedResult } = useCalculator()

    if (adjustedResult instanceof HitResult) {
        return (
            <Surface style={styles.powderSenseSwitchRow} elevation={0}>
                <Text style={{ flex: 3 }}>
                    Powder sensitivity
                </Text>
                <Chip style={{ flex: 2 }} disabled>
                    {(profileProperties.cTCoeff / 1000).toFixed(2)} %/15°C
                </Chip>
            </Surface>
        )
    }
}


const PowderSenseValue = () => {
    const { powderTemperature } = useCurrentConditions()

    const currentTemp = powderTemperature.asString
    const currentTempSymbol = powderTemperature.symbol
    return (
        <WeatherPowderTemperatureDialog button={
            <Button
                mode="outlined"
                icon={"thermometer"}
                onPress={() => console.log('cTemp')}
                style={styles.fabStyle}
            >
                Powder temperature {currentTemp} {currentTempSymbol}
            </Button>
        } />
    )
}


export const WeatherTopContainer = () => {
    const { currentConditions, updateCurrentConditions } = useCurrentConditions()
    const { usePowderSens, useDifferentPowderTemperature } = currentConditions

    const onTogglePowderSens = () => {
        updateCurrentConditions({
            usePowderSens: !usePowderSens
        })
    }

    const onToggleDiffPowderTemp = () => {
        updateCurrentConditions({
            useDifferentPowderTemperature: !useDifferentPowderTemperature
        })
    }

    return (
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

            {usePowderSens && <Surface style={styles.powderSenseSwitchRow} elevation={0}>
                <Text>Use different powder temperature</Text>
                <Switch
                    value={useDifferentPowderTemperature}
                    onValueChange={onToggleDiffPowderTemp}
                />
            </Surface>}

            {usePowderSens && useDifferentPowderTemperature && <PowderSenseValue />}
            {usePowderSens && <CurrentVelocity />}
            {usePowderSens && <PowderSense />}

        </Surface>
    )
}


export const WeatherContent = () => {

    return (
        <ScrollViewSurface
            style={styles.scrollView}
            keyboardShouldPersistTaps="always"
            alwaysBounceVertical={false}
            showsVerticalScrollIndicator={true}
            elevation={1}
            surfaceStyle={styles.scrollViewContainer}
        >
            <WeatherTopContainer />
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