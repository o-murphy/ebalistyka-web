import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Dialog, FAB, HelperText, Portal, TextInput } from "react-native-paper";
import { useCalculator } from "../../../../context/profileContext";
import { UNew, Unit, UnitProps, Velocity, Angular, Distance } from "js-ballistics/dist/v2";
import { usePreferredUnits } from "../../../../context/preferredUnitsContext";
import { DoubleSpinBox, SpinBoxProps } from "../../../../components/widgets/doubleSpinBox";
import getFractionDigits from "../../../../utils/fractionConvertor";
import { RulerSlider } from "../../../../components/widgets/ruler/ruler";
import { StyleSheet } from "react-native";

type UnitType = "velocity" | "angular" | "distance";
type UnitClass = typeof Velocity | typeof Angular | typeof Distance;

interface UnitRange {
    min: InstanceType<UnitClass>;
    max: InstanceType<UnitClass>;
    fraction: number;
}

interface ValueDialogProps {
    button: React.ReactElement;
    fieldKey: string;
    label: string;
    icon: string;
    unitType: UnitType;
    unitTypeClass: UnitClass;
    defUnit: Unit;
    range: UnitRange;
    autofocus?: boolean;
    enableSlider?: boolean;
}

const useCurrentValue = (value: number, unitTypeClass: UnitClass, defUnit: Unit, prefUnit: Unit) =>
    useMemo(() => new unitTypeClass(value, defUnit).In(prefUnit), [value, unitTypeClass, defUnit, prefUnit]);

const ValueSlider = ({ fieldProps, value, onChange, style = null }) => {
    const scrollWheelProps = useMemo(() => ({
        minValue: fieldProps.minValue,
        maxValue: fieldProps.maxValue,
        width: 200,
        height: 350,
        fraction: fieldProps.fractionDigits,
        step: fieldProps.step,
        value,
        onChange
    }), [fieldProps, value, onChange]);

    return <RulerSlider {...scrollWheelProps} style={style} />;
};

const ValueDialog: React.FC<ValueDialogProps> = ({
    button, fieldKey, label, icon, unitType, unitTypeClass, defUnit, range, autofocus = false, enableSlider = false
}) => {
    const { currentConditions, updateCurrentConditions } = useCalculator();
    const { preferredUnits } = usePreferredUnits();
    const [visible, setVisible] = useState(false);
    const [localValue, setLocalValue] = useState(0);
    const [error, setError] = useState<Error | null>(null);

    const prefUnit = useMemo(() => preferredUnits[unitType], [preferredUnits, unitType]);
    const accuracy = useMemo(() => getFractionDigits(range.fraction, new unitTypeClass(1, defUnit).In(prefUnit)),
        [prefUnit, defUnit, unitTypeClass, range.fraction]);
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
            ref: (node) => autofocus && node?.focus(),
            mode: "outlined",
            dense: true,
            style: styles.input,
            contentStyle: styles.inputContent,
            right: <TextInput.Affix text={UnitProps[prefUnit].symbol} textStyle={styles.affix} />,
        },
    }), [accuracy, prefUnit, fieldKey, range, autofocus]);

    const hideDialog = useCallback(() => setVisible(false), []);
    const showDialog = useCallback(() => {
        setLocalValue(currentValue);
        setVisible(true);
    }, [currentValue]);

    const onSubmit = useCallback(() => {
        if (!error) {
            updateCurrentConditions({
                [fieldKey]: new unitTypeClass(localValue, prefUnit).In(defUnit),
            });
            hideDialog();
        }
    }, [error, fieldKey, unitTypeClass, localValue, prefUnit, defUnit, hideDialog]);

    return (
        <>
            {React.cloneElement(button, { label: `${currentValue.toFixed(accuracy)} ${UnitProps[prefUnit].symbol}`, onPress: showDialog })}
            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog} style={styles.dialog}>
                    <Dialog.Icon icon={icon} />
                    <Dialog.Title style={styles.dialogTitle}>{label}</Dialog.Title>
                    <Dialog.Content style={styles.dialogContent}>
                        <DoubleSpinBox value={localValue} onValueChange={setLocalValue} onError={setError} {...fieldProps} />
                        {error && <HelperText type="error" visible={!!error}>{error.message}</HelperText>}
                        {enableSlider && <ValueSlider fieldProps={fieldProps} value={localValue} onChange={setLocalValue} style={styles.slider} />}
                    </Dialog.Content>
                    <Dialog.Actions>
                        {!error && <FAB size="small" icon="check" mode="flat" variant="secondary" onPress={onSubmit} />}
                        <FAB size="small" icon="close" mode="flat" variant="tertiary" onPress={hideDialog} />
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </>
    );
};

const styles = StyleSheet.create({
    dialog: {
        alignSelf: "center",
        width: 250,
    },
    dialogTitle: {
        textAlign: "center",
    },
    dialogContent: {
        alignItems: "center",
        justifyContent: "center",
    },
    input: {
        width: 100,
    },
    inputContent: {
        textAlign: "center",
    },
    affix: {
        textAlign: "right",
    },
    slider: {
        marginTop: 16,
    },
});

export const WindSpeedDialog: React.FC<{ button: React.ReactElement }> = ({ button }) => (
    <ValueDialog
        button={button}
        fieldKey="windSpeed"
        label="Wind speed"
        icon="windsock"
        unitType="velocity"
        unitTypeClass={Velocity}
        defUnit={Unit.MPS}
        range={{ min: UNew.MPS(0), max: UNew.MPS(100), fraction: 0.1 }}
        enableSlider
    />
);

export const LookAngleDialog: React.FC<{ button: React.ReactElement }> = ({ button }) => (
    <ValueDialog
        button={button}
        fieldKey="lookAngle"
        label="Look angle"
        icon="angle-acute"
        unitType="angular"
        unitTypeClass={Angular}
        defUnit={Unit.Degree}
        range={{ min: UNew.Degree(-90), max: UNew.Degree(90), fraction: 0.1 }}
        enableSlider
    />
);

export const TargetDistanceDialog: React.FC<{ button: React.ReactElement }> = ({ button }) => (
    <ValueDialog
        button={button}
        fieldKey="targetDistance"
        label="Target distance"
        icon="map-marker-distance"
        unitType="distance"
        unitTypeClass={Distance}
        defUnit={Unit.Meter}
        range={{ min: UNew.Meter(0), max: UNew.Meter(3000), fraction: 1 }}
        enableSlider
    />
);