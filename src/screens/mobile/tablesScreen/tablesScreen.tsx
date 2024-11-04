import { View } from "react-native";
import { useTheme } from "../../../context/themeContext";
import { Appbar, Dialog, FAB, IconButton, Portal, Text } from "react-native-paper";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { useCallback, useEffect, useMemo, useState } from "react";
import SettingsUnitCard from "../../../components/cards/settingsCard";
import { useCalculator } from "../../../context/profileContext";
import { TrajectoryTable, ZerosDataTable } from "../../../components/widgets/tableView/tableView";
import { MeasureFormFieldProps, MeasureFormFieldRefreshable } from "../../../components/widgets/measureFields/measureField";
import { usePreferredUnits } from "../../../context/preferredUnitsContext";
import { Distance, UNew, Unit, UnitProps } from "js-ballistics/dist/v2";
import getFractionDigits from "../../../utils/fractionConvertor";


export const TablesTopAppBar = ({ ...props }: NativeStackHeaderProps) => {

    const { back, navigation } = props;

    const { theme } = useTheme()
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


export const TrajectoryStepField = ({trajectoryStep, setTrajectoryStep, onError}) => {

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

    const value: number = useMemo(() => UNew.Meter(
        trajectoryStep ? 
        trajectoryStep : 100
    ).In(prefUnit), [trajectoryStep, prefUnit])

    const onValueChange = useCallback((value: number): void => {
        setTrajectoryStep(value)
    }, [prefUnit]);

    return (
        <MeasureFormFieldRefreshable 
            fieldProps={fieldProps}
            value={value}
            onValueChange={onValueChange}
            refreshable={false}
            buttonPosition="left"
            onError={onError}
        />
    )
}


export const TrajectoryRangeField = ({trajectoryRange, setTrajectoryRange, onError}) => {

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

    const value: number = useMemo(() => UNew.Meter(
        trajectoryRange ? 
        trajectoryRange : 100
    ).In(prefUnit), [trajectoryRange, prefUnit])

    const onValueChange = useCallback((value: number): void => {
        setTrajectoryRange(value)
    }, [prefUnit]);

    return (
        <MeasureFormFieldRefreshable 
            fieldProps={fieldProps}
            value={value}
            onValueChange={onValueChange}
            refreshable={false}
            buttonPosition="left"
            onError={onError}
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
            updateCurrentConditions({
                trajectoryStep: new Distance(trajectoryStep, preferredUnits.distance).In(Unit.Meter),
                trajectoryRange: new Distance(trajectoryRange, preferredUnits.distance).In(Unit.Meter),
            })
            setVisible(false)    
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
                <Dialog.Title>Tables settings</Dialog.Title>
                <Dialog.Content>
                    <TrajectoryRangeField trajectoryRange={trajectoryRange} setTrajectoryRange={setTrajectoryRange} onError={setRangeError} />
                    <TrajectoryStepField trajectoryStep={trajectoryStep} setTrajectoryStep={setTrajectoryStep} onError={setStepError} />
                </Dialog.Content>
                <Dialog.Actions>
                    <FAB size="small" icon="check" variant="secondary" onPress={onSubmit} />
                    <FAB size="small" icon="close" variant="tertiary" onPress={hideDialog} />
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}


export const TablesScreen = ({ navigation }) => {
    const { theme } = useTheme();
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