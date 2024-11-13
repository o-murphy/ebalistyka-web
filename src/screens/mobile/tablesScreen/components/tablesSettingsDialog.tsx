import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { Dialog, FAB, IconButton, Portal, Surface, Switch, Text } from "react-native-paper";
import { useTableSettings } from "../../../../context/tableSettingsContext";
import { DimensionField } from "../../components";


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

    const { tableSettings, updateTableSettings, trajectoryStep, trajectoryRange } = useTableSettings();

    const [localStep, setLocalStep] = useState(trajectoryStep.asPref)
    const [localRange, setLocalRange] = useState(trajectoryRange.asPref)

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

    useEffect(() => {
        setLocalStep(trajectoryStep.asPref)
    }, [trajectoryStep])

    useEffect(() => {
        setLocalRange(trajectoryRange.asPref)
    }, [trajectoryRange])

    const updateDisplaySetting = (key, value) => {
        setDisplaySettings((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const onSubmit = () => {
        if (!stepError && !rangeError) {
            updateTableSettings({
                ...displaySettings
            })
            trajectoryStep.setAsPref(localStep)
            trajectoryRange.setAsPref(localRange)
            setVisible(false)
        }
    }

    const hideDialog = () => {
        setLocalStep(trajectoryStep.asPref)
        setLocalRange(trajectoryRange.asPref)
        setVisible(false)
    }

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={hideDialog} style={{ height: "80%", maxWidth: 400, alignSelf: "center"}}>

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
                                <DimensionField
                                    label="Trajectory range"
                                    icon="map-marker-distance"
                                    dimension={trajectoryRange}
                                    value={localRange}
                                    onValueChange={setLocalRange}
                                    onError={setRangeError}
                                />
                            </Surface>

                            <Surface style={{ marginVertical: 8 }} elevation={0}>
                                <DimensionField
                                    label="Trajectory step"
                                    icon="delta"
                                    dimension={trajectoryStep}
                                    value={localStep}
                                    onValueChange={setLocalStep}
                                    onError={setStepError}
                                />
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