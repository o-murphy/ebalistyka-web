import { useMemo, useState } from "react";
import { ScrollView } from "react-native";
import { Dialog, FAB, HelperText, IconButton, Portal, Surface, Switch, Text } from "react-native-paper";
import MeasureFormField, { MeasureFormFieldProps } from "../../../../components/widgets/measureFields/measureField";
import { usePreferredUnits } from "../../../../context/preferredUnitsContext";
import { Distance, UNew, Unit, UnitProps } from "js-ballistics/dist/v2";
import getFractionDigits from "../../../../utils/fractionConvertor";
import { useTableSettings } from "../../../../context/tableSettingsContext";



// Define UnitType and UnitTypeClass to accept class types for handling units
type UnitClass = typeof Distance; // Add other unit classes if needed


const useCurrentValue = (
    value: number,
    unitTypeClass: UnitClass,
    defUnit: Unit,
    prefUnit: Unit
): number => {
    return new unitTypeClass(value, defUnit).In(prefUnit);
};


const TrajectoryStepField = ({ trajectoryStep, setTrajectoryStep, onError }) => {

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


const TrajectoryRangeField = ({ trajectoryRange, setTrajectoryRange, onError }) => {

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


const displayOptions = [
    { label: "Display zeros", key: "displayZeros" },
    { label: "Time", key: "displayTime" },
    { label: "Range", key: "displayRange" },
    { label: "Velocity", key: "displayVelocity" },
    { label: "Height", key: "displayHeight" },
    { label: "Drop", key: "displayDrop" },
    { label: "Drop Adjustment", key: "displayDropAdjustment" },
    { label: "Windage", key: "displayWindage" },
    { label: "Windage Adjustment", key: "displayWindageAdjustment" },
    { label: "Mach", key: "displayMach" },
    { label: "Drag", key: "displayDrag" },
    { label: "Energy", key: "displayEnergy" },
];


const TableSettingsDialog = ({ visible, setVisible }) => {

    const { tableSettings, updateTableSettings } = useTableSettings();
    const { preferredUnits } = usePreferredUnits()

    const [trajectoryStep, setTrajectoryStep] = useState(tableSettings?.trajectoryStep)
    const [trajectoryRange, setTrajectoryRange] = useState(tableSettings?.trajectoryRange)
    const [stepError, setStepError] = useState(null)
    const [rangeError, setRangeError] = useState(null)

    const initialDisplaySettings = {
        displayZeros: tableSettings?.displayZeros ?? true,

        displayTime: tableSettings?.displayTime ?? true,
        displayRange: tableSettings?.displayRange ?? true,
        displayVelocity: tableSettings?.displayVelocity ?? true,
        displayHeight: tableSettings?.displayHeight ?? true,
        displayDrop: tableSettings?.displayDrop ?? true,
        displayDropAdjustment: tableSettings?.displayDropAdjustment ?? true,
        displayWindage: tableSettings?.displayWindage ?? true,
        displayWindageAdjustment: tableSettings?.displayWindageAdjustment ?? true,
        displayMach: tableSettings?.displayMach ?? true,
        displayDrag: tableSettings?.displayDrag ?? true,
        displayEnergy: tableSettings?.displayEnergy ?? true,
    };

    const [displaySettings, setDisplaySettings] = useState(initialDisplaySettings);

    // To update a specific setting:
    const updateDisplaySetting = (key, value) => {
        setDisplaySettings((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const onSubmit = () => {
        if (!stepError && !rangeError) {
            // setSubmitError(null)
            updateTableSettings({
                trajectoryStep: new Distance(trajectoryStep, preferredUnits.distance).In(Unit.Meter),
                trajectoryRange: new Distance(trajectoryRange, preferredUnits.distance).In(Unit.Meter),

                ...displaySettings
            })
            setVisible(false)
        } else {
            // setSubmitError(new Error("Invalid tables settings"))
        }
    }

    const hideDialog = () => {
        setTrajectoryStep(tableSettings?.trajectoryStep)
        setTrajectoryRange(tableSettings?.trajectoryRange)
        setVisible(false)
    }

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={hideDialog} style={{ height: "80%" }}>

                <Dialog.Title>
                    <Surface style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }} elevation={0}>
                        <Text>Tables settings</Text>
                        <IconButton icon={"close"} onPress={hideDialog} />
                    </Surface>
                </Dialog.Title>
                <Dialog.ScrollArea>
                    <ScrollView style={{ flex: 1 }}>
                        <Dialog.Content>

                            <Surface style={{ marginVertical: 8 }} elevation={0}>
                                <TrajectoryRangeField trajectoryRange={trajectoryRange} setTrajectoryRange={setTrajectoryRange} onError={setRangeError} />
                                {rangeError && <HelperText type="error" visible={!!rangeError}>
                                    {rangeError.message}
                                </HelperText>}
                            </Surface>

                            <Surface style={{ marginVertical: 8 }} elevation={0}>
                                <TrajectoryStepField trajectoryStep={trajectoryStep} setTrajectoryStep={setTrajectoryStep} onError={setStepError} />
                                {stepError && <HelperText type="error" visible={!!stepError}>
                                    {stepError.message}
                                </HelperText>}
                            </Surface>

                            {displayOptions.map((option) => (
                                <Surface
                                    key={option.key}
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        marginHorizontal: 8,
                                        marginVertical: 8,
                                    }}
                                    elevation={0}
                                >
                                    <Text>{option.label}</Text>
                                    <Switch
                                        value={displaySettings[option.key]}
                                        onValueChange={() =>
                                            updateDisplaySetting(option.key, !displaySettings[option.key])
                                        }
                                    />
                                </Surface>
                            ))}

                        </Dialog.Content>

                    </ScrollView>
                </Dialog.ScrollArea>

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


export default TableSettingsDialog;