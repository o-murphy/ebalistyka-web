import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Dialog, FAB, HelperText, Icon, Portal, Text, TextInput } from "react-native-paper";
import { useCalculator } from "../../../../context/profileContext";
import { UNew, Unit, UnitProps, Velocity, Angular, Distance } from "js-ballistics/dist/v2";
import { usePreferredUnits } from "../../../../context/preferredUnitsContext";
import { DoubleSpinBox, SpinBoxProps } from "../../../../components/widgets/doubleSpinBox";
import getFractionDigits from "../../../../utils/fractionConvertor";


// Define UnitType and UnitTypeClass to accept class types for handling units
type UnitType = "velocity" | "angular" | "distance"; // Add other types if needed
type UnitClass = typeof Velocity | typeof Angular | typeof Distance; // Add other unit classes if needed

interface UnitRange {
    min: InstanceType<UnitClass>; // Assumes min and max are instances of unit classes
    max: InstanceType<UnitClass>;
    fraction: number;
}

interface ValueDialogProps {
    button: React.ReactElement; // Button element passed to the dialog
    fieldKey: string; // Key for accessing the field in currentConditions
    label: string; // Label to display
    icon: string; // Icon name from MaterialCommunityIcons
    unitType: UnitType; // Type of unit to be used
    unitTypeClass: UnitClass; // Unit class type (e.g., Velocity, Angular)
    defUnit: Unit; // Default unit of measurement
    range: UnitRange; // Range object with min, max, and fraction
}

const useCurrentValue = (
    value: number,
    unitTypeClass: UnitClass,
    defUnit: Unit,
    prefUnit: Unit
): number => {
    return new unitTypeClass(value, defUnit).In(prefUnit);
};

const ValueDialog: React.FC<ValueDialogProps> = ({
    button,
    fieldKey,
    label,
    icon,
    unitType,
    unitTypeClass,
    defUnit,
    range,
}) => {
    const { currentConditions, updateCurrentConditions } = useCalculator();
    const { preferredUnits } = usePreferredUnits();
    const [visible, setVisible] = useState(false);
    const [localValue, setLocalValue] = useState(0);
    const [error, setError] = useState<Error | null>(null);
    const inputRef = useCallback((node) => node?.focus(), []);

    const prefUnit = useMemo(() => preferredUnits[unitType], [preferredUnits, unitType]);
    const accuracy = useMemo(
        () => getFractionDigits(range.fraction, new unitTypeClass(1, defUnit).In(prefUnit)),
        [prefUnit, defUnit, unitTypeClass, range.fraction]
    );
    const currentValue = useCurrentValue(currentConditions[fieldKey], unitTypeClass, defUnit, prefUnit);

    useEffect(() => {
        setLocalValue(currentValue);
    }, [currentValue]);

    const fieldProps: Partial<SpinBoxProps> = useMemo(() => ({
        fKey: fieldKey,
        fractionDigits: accuracy,
        step: 1 / 10 ** accuracy,
        minValue: range.min.In(prefUnit),
        maxValue: range.max.In(prefUnit),
        inputProps: {
            ref: inputRef,
            mode: "outlined",
            dense: true,
            style: { flex: 1 },
            contentStyle: { textAlign: "center" },
            right: <TextInput.Affix text={UnitProps[prefUnit].symbol} textStyle={{ textAlign: "right" }} />,
        },
    }), [accuracy, prefUnit, fieldKey, label, icon, range, inputRef]);

    const labelWithUnit = `${currentValue?.toFixed(accuracy)} ${UnitProps[prefUnit].symbol}`;

    const hideDialog = () => setVisible(false);
    const showDialog = () => {
        setLocalValue(currentValue);
        setVisible(true);
    };

    const onSubmit = () => {
        if (!error) {
            updateCurrentConditions({
                [fieldKey]: new unitTypeClass(localValue, prefUnit).In(defUnit),
            });
            hideDialog();
        }
    };

    return (
        <>
            {React.cloneElement(button, { label: labelWithUnit, onPress: showDialog })}
            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog} style={{ alignSelf: "center", width: 300 }}>
                    <Dialog.Content style={{ alignItems: "center", justifyContent: "center"}}>
                        <Icon size={40} source={icon} />
                        <Text variant="bodyLarge" style={{ marginVertical: 8 }}>{label}</Text>
                        <DoubleSpinBox value={localValue} onValueChange={setLocalValue} onError={setError} {...fieldProps} />
                        {error && <HelperText type="error" visible={!!error}>{error.message}</HelperText>}
                    </Dialog.Content>
                    <Dialog.Actions>
                        <FAB size="small" icon="check" variant="secondary" onPress={onSubmit} />
                        <FAB size="small" icon="close" variant="tertiary" onPress={hideDialog} />
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </>
    );
};

interface DialogValuePickerProps {
    button: React.ReactElement;
}

export const WindSpeedDialog: React.FC<DialogValuePickerProps> = ({ button }) => (
    <ValueDialog
        button={button}
        fieldKey="windSpeed"
        label="Wind speed"
        icon="windsock"
        unitType="velocity"
        unitTypeClass={Velocity}
        defUnit={Unit.MPS}
        range={{ min: UNew.MPS(0), max: UNew.MPS(100), fraction: 0.1 }}
    />
);

export const LookAngleDialog: React.FC<DialogValuePickerProps> = ({ button }) => (
    <ValueDialog
        button={button}
        fieldKey="lookAngle"
        label="Look angle"
        icon="angle-acute"
        unitType="angular"
        unitTypeClass={Angular}
        defUnit={Unit.Degree}
        range={{ min: UNew.Degree(-90), max: UNew.Degree(90), fraction: 0.1 }}
    />
);

export const TargetDistanceDialog: React.FC<DialogValuePickerProps> = ({ button }) => (
    <ValueDialog
        button={button}
        fieldKey="targetDistance"
        label="Target distance"
        icon="map-marker-distance"
        unitType="distance"
        unitTypeClass={Distance}
        defUnit={Unit.Meter}
        range={{ min: UNew.Meter(10), max: UNew.Meter(3000), fraction: 1 }}
    />
);