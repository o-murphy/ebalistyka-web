import { View } from "react-native";
import { Appbar, Button, Dialog, FAB, HelperText, IconButton, Portal, Text, useTheme } from "react-native-paper";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { useMemo, useState } from "react";
import SettingsUnitCard from "../../../components/cards/settingsCard";
import { useCalculator } from "../../../context/profileContext";
import { TrajectoryTable, ZerosDataTable } from "../../../components/widgets/tableView/tableView";
import MeasureFormField, { MeasureFormFieldProps } from "../../../components/widgets/measureFields/measureField";
import { usePreferredUnits } from "../../../context/preferredUnitsContext";
import { Distance, UNew, Unit, UnitProps } from "js-ballistics/dist/v2";
import getFractionDigits from "../../../utils/fractionConvertor";


export const TablesTopAppBar = ({ ...props }: NativeStackHeaderProps) => {

    const { back, navigation } = props;

    const theme = useTheme()
    const [settingsVisible, setSettingsVisible] = useState(false)

    return (
        <Appbar.Header mode={"center-aligned"} style={{
            height: 48,
            backgroundColor: theme.colors.elevation.level2
        }}>
            <Appbar.BackAction onPress={() => navigation.navigate(back.title)} />
            <Appbar.Content title="Tables" />
            <Appbar.Action icon="cog-outline" onPress={() => setSettingsVisible(true)} />

            <SettingsUnitCard visibility={[settingsVisible, setSettingsVisible]} />

        </Appbar.Header>
    )
}


// Define UnitType and UnitTypeClass to accept class types for handling units
type UnitType = "velocity" | "angular" | "distance"; // Add other types if needed
type UnitClass = typeof Distance; // Add other unit classes if needed


const useCurrentValue = (
    value: number,
    unitTypeClass: UnitClass,
    defUnit: Unit,
    prefUnit: Unit
): number => {
    return new unitTypeClass(value, defUnit).In(prefUnit);
};


export const TrajectoryStepField = ({ trajectoryStep, setTrajectoryStep, onError }) => {

    const { preferredUnits } = usePreferredUnits()

    const prefUnit = useMemo(() => preferredUnits.distance, [preferredUnits.distance])
    const accuracy = useMemo(() => getFractionDigits(1, UNew.Meter(1).In(prefUnit)), [prefUnit])

    const fieldProps: Partial<MeasureFormFieldProps> = useMemo(() => ({
        fKey: "trajectoryStep",
        label: "Trajectory step",
        icon: "delta",
        fractionDigits: accuracy,
        // step: 1 / (10 ** accuracy),
        step: 10,
        suffix: UnitProps[prefUnit].symbol,
        minValue: UNew.Meter(10).In(prefUnit),
        maxValue: UNew.Meter(500).In(prefUnit),
    }), [accuracy, prefUnit])

    const value = useCurrentValue(trajectoryStep, Distance, Unit.Meter, prefUnit)
    const onValueChange = setTrajectoryStep

    return (
        <MeasureFormField
            {...fieldProps}
            value={value}
            onValueChange={onValueChange}
            onError={onError}
            strict={false}
        />
    )
}


export const TrajectoryRangeField = ({ trajectoryRange, setTrajectoryRange, onError }) => {

    const { preferredUnits } = usePreferredUnits()

    const prefUnit = useMemo(() => preferredUnits.distance, [preferredUnits.distance])
    const accuracy = useMemo(() => getFractionDigits(1, UNew.Meter(1).In(prefUnit)), [prefUnit])

    const fieldProps: Partial<MeasureFormFieldProps> = useMemo(() => ({
        fKey: "trajectoryRange",
        label: "Trajectory range",
        icon: "map-marker-distance",
        fractionDigits: accuracy,
        step: 1 / (10 ** accuracy),
        suffix: UnitProps[prefUnit].symbol,
        minValue: UNew.Meter(10).In(prefUnit),
        maxValue: UNew.Meter(3000).In(prefUnit),
    }), [accuracy, prefUnit])

    const value = useCurrentValue(trajectoryRange, Distance, Unit.Meter, prefUnit)
    const onValueChange = setTrajectoryRange
    console.log("FFF", value)

    return (
        <MeasureFormField
            {...fieldProps}
            value={value}
            onValueChange={onValueChange}
            onError={onError}
            strict={false}
        />
    )
}


export const TableSettingsDialog = ({ visible, setVisible }) => {

    const { currentConditions, updateCurrentConditions } = useCalculator();
    const { preferredUnits } = usePreferredUnits()

    const [trajectoryStep, setTrajectoryStep] = useState(currentConditions?.trajectoryStep)
    const [trajectoryRange, setTrajectoryRange] = useState(currentConditions?.trajectoryRange)
    const [stepError, setStepError] = useState(null)
    const [rangeError, setRangeError] = useState(null)

    const onSubmit = () => {
        if (!stepError && !rangeError) {
            // setSubmitError(null)
            updateCurrentConditions({
                trajectoryStep: new Distance(trajectoryStep, preferredUnits.distance).In(Unit.Meter),
                trajectoryRange: new Distance(trajectoryRange, preferredUnits.distance).In(Unit.Meter),
            })
            setVisible(false)
        } else {
            // setSubmitError(new Error("Invalid tables settings"))
        }
    }

    const hideDialog = () => {
        setTrajectoryStep(currentConditions?.trajectoryStep)
        setTrajectoryRange(currentConditions?.trajectoryRange)
        setVisible(false)
    }

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={hideDialog}>
                <Dialog.Title>
                    <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <Text>Tables settings</Text>
                        <IconButton icon={"close"} onPress={hideDialog} />
                    </View>
                </Dialog.Title>
                <Dialog.Content>

                    <View style={{ marginBottom: 16 }}>
                        <TrajectoryRangeField trajectoryRange={trajectoryRange} setTrajectoryRange={setTrajectoryRange} onError={setRangeError} />
                        {rangeError && <HelperText type="error" visible={!!rangeError}>
                            {rangeError.message}
                        </HelperText>}
                    </View>

                    <TrajectoryStepField trajectoryStep={trajectoryStep} setTrajectoryStep={setTrajectoryStep} onError={setStepError} />
                    {stepError && <HelperText type="error" visible={!!stepError}>
                        {stepError.message}
                    </HelperText>}

                </Dialog.Content>
                <Dialog.Actions>
                    {(!stepError && !rangeError) && <FAB
                        size="small"
                        icon="check"
                        variant="secondary"
                        mode="flat"
                        onPress={onSubmit}
                    />}
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}


export const TablesScreen = ({ navigation = null }) => {
    const theme = useTheme();
    const { hitResult } = useCalculator()

    const [settingsVisible, setSettingsVisible] = useState(false)

    const onExport = () => {
        console.log("On export")
    }

    const onSettings = () => {
        setSettingsVisible(true)
    }


    return (
        <View style={{
            flex: 1,
            backgroundColor: theme.colors.background,
            marginBottom: 64,
        }}>

            <TableSettingsDialog visible={settingsVisible} setVisible={setSettingsVisible} />

            <View style={{ height: 40, justifyContent: "center" }}>
                <Text style={{ textAlign: "center" }}>Zero crossing points</Text>
            </View>
            <ZerosDataTable hitResult={hitResult} />

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <IconButton icon={"export-variant"} onPress={onExport} />
                <View style={{ justifyContent: "center" }}>
                    <Text style={{ textAlign: "center" }}>Trajectory</Text>
                </View>
                <IconButton icon={"tune"} onPress={onSettings} />
            </View>
            <TrajectoryTable hitResult={hitResult} style={{ flex: 1 }} />
        </View>
    )
}