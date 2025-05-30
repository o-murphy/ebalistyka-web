import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { Chip, FAB, Surface, Switch, Text } from "react-native-paper";
import { useProfile, useCalculator, useCurrentConditions } from "../../../context";
import { HitResult, Unit, Velocity } from "js-ballistics";
import { useDimension } from "../../../hooks";
import { NumericDialog, ScrollViewSurface } from "../../../components/widgets";
import { DimensionDialogChip } from "../../../components/widgets";
import { WeatherTemperatureDialog, WeatherPressureDialog } from "./weatherValueDialogs";


const CurrentVelocity = () => {
    const { adjustedResult } = useCalculator()
    const { temperature, powderTemperature, flags: currentConditions } = useCurrentConditions()
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
    const { profileProperties } = useProfile()
    const { adjustedResult } = useCalculator()

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

    return (
        <Surface style={{marginHorizontal: 16}} elevation={0}>
            <DimensionDialogChip icon={"thermometer"} title={"Powder temperature"} dimension={powderTemperature} enableSlider={true}/>
        </Surface>
    )
}


export const WeatherTopContainer = () => {
    const { flags: currentConditions, updateFlags: updateCurrentConditions, humidity } = useCurrentConditions()
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

                <NumericDialog 
                    button={
                        <FAB
                            size="small"
                            icon={"water"}
                            onPress={() => console.log('Wind')}
                            label={"50 %"}
                            style={styles.fabStyle}
                        />
                    }
                    label="Humidity"
                    icon="water"
                    numeral={humidity}
                    enableSlider
                />

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


export const WeatherContainer = () => {

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