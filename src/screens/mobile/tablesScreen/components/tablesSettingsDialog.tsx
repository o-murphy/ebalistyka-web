import { useMemo, useState } from "react";
import { View } from "react-native";
import { Dialog, FAB, HelperText, IconButton, Portal, Text } from "react-native-paper";
import MeasureFormField, { MeasureFormFieldProps } from "../../../../components/widgets/measureFields/measureField";
import { usePreferredUnits } from "../../../../context/preferredUnitsContext";
import { Distance, UNew, Unit, UnitProps } from "js-ballistics/dist/v2";
import getFractionDigits from "../../../../utils/fractionConvertor";
import { useCalculator } from "../../../../context/profileContext";
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

    // const { currentConditions, updateCurrentConditions } = useCalculator();
    const { tableSettings, updateTableSettings } = useTableSettings();
    const { preferredUnits } = usePreferredUnits()

    const [trajectoryStep, setTrajectoryStep] = useState(tableSettings?.trajectoryStep)
    const [trajectoryRange, setTrajectoryRange] = useState(tableSettings?.trajectoryRange)
    const [stepError, setStepError] = useState(null)
    const [rangeError, setRangeError] = useState(null)

    const onSubmit = () => {
        if (!stepError && !rangeError) {
            // setSubmitError(null)
            updateTableSettings({
                trajectoryStep: new Distance(trajectoryStep, preferredUnits.distance).In(Unit.Meter),
                trajectoryRange: new Distance(trajectoryRange, preferredUnits.distance).In(Unit.Meter),
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