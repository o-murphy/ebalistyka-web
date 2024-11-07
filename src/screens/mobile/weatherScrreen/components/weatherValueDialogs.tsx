import React, { useCallback, useEffect, useMemo, useState } from "react"
import { usePreferredUnits } from "../../../../context/preferredUnitsContext"
import getFractionDigits from "../../../../utils/fractionConvertor"
import { Pressure, Temperature, UNew, Unit, UnitProps } from "js-ballistics/dist/v2"
import { Dialog, FAB, HelperText, Portal, TextInput } from "react-native-paper"
import { DoubleSpinBox, SpinBoxProps } from "../../../../components/widgets/doubleSpinBox"
import { useCalculator } from "../../../../context/profileContext"
import { RulerSlider } from "../../../../components/widgets/ruler/ruler"
import { StyleSheet } from "react-native"


type UnitType = "temperature" | "pressure";
type UnitClass = typeof Temperature | typeof Pressure;

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



const ValueDialogHumidity: React.FC<Partial<ValueDialogProps>> = ({
    button, fieldKey, label, icon, autofocus = false, enableSlider = false
}) => {
    const { currentConditions, updateCurrentConditions } = useCalculator();
    const [visible, setVisible] = useState(false);
    const [localValue, setLocalValue] = useState(0);
    const [error, setError] = useState<Error | null>(null);

    const accuracy = 0;
    const currentValue = currentConditions[fieldKey];

    useEffect(() => {
        setLocalValue(currentValue);
    }, [currentValue]);

    const fieldProps: Partial<SpinBoxProps> = useMemo(() => ({
        fKey: fieldKey,
        fractionDigits: accuracy,
        step: 1 / 10 ** accuracy,
        minValue: 0,
        maxValue: 100,
        inputProps: {
            ref: (node) => autofocus && node?.focus(),
            mode: "outlined",
            dense: true,
            style: styles.input,
            contentStyle: styles.inputContent,
            right: <TextInput.Affix text={"%"} textStyle={styles.affix} />,
        },
    }), [accuracy, fieldKey, autofocus]);

    const hideDialog = useCallback(() => setVisible(false), []);
    const showDialog = useCallback(() => {
        setLocalValue(currentValue);
        setVisible(true);
    }, [currentValue]);

    const onSubmit = useCallback(() => {
        if (!error) {
            updateCurrentConditions({
                [fieldKey]: localValue,
            });
            hideDialog();
        }
    }, [error, fieldKey, localValue, hideDialog]);

    return (
        <>
            {React.cloneElement(button, { label: `${currentValue.toFixed(accuracy)} %`, onPress: showDialog })}
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



const WeatherTemperatureDialog: React.FC<{ button: React.ReactElement }> = ({ button }) => (
    <ValueDialog
        button={button}
        fieldKey="temperature"
        label="Temperature"
        icon="thermometer"
        unitType="temperature"
        unitTypeClass={Temperature}
        defUnit={Unit.Celsius}
        range={{ min: UNew.Celsius(-50), max: UNew.Celsius(50), fraction: 2 }}
        enableSlider
    />
);


const WeatherPowderTemperatureDialog: React.FC<{ button: React.ReactElement }> = ({ button }) => (
    <ValueDialog
        button={button}
        fieldKey="powderTemperature"
        label="Temperature"
        icon="thermometer"
        unitType="temperature"
        unitTypeClass={Temperature}
        defUnit={Unit.Celsius}
        range={{ min: UNew.Celsius(-50), max: UNew.Celsius(50), fraction: 2 }}
        enableSlider
    />
);


const WeatherPressureDialog: React.FC<{ button: React.ReactElement }> = ({ button }) => (
    <ValueDialog
        button={button}
        fieldKey="pressure"
        label="Pressure"
        icon="gauge"
        unitType="pressure"
        unitTypeClass={Pressure}
        defUnit={Unit.hPa}
        range={{ min: UNew.hPa(500), max: UNew.hPa(1300), fraction: 2 }}
        enableSlider
    />
);


const WeatherHumidityDialog: React.FC<{ button: React.ReactElement }> = ({ button }) => (
    <ValueDialogHumidity
        button={button}
        fieldKey="humidity"
        label="humidity"
        icon="water"
        unitType={null}
        unitTypeClass={null}
        defUnit={null}
        enableSlider
    />
);


export {
    WeatherTemperatureDialog,
    WeatherPressureDialog,
    WeatherHumidityDialog,
    WeatherPowderTemperatureDialog,
};