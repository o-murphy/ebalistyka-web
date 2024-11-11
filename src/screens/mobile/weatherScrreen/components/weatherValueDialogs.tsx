import React, { useCallback, useEffect, useMemo, useState } from "react"
import { usePreferredUnits } from "../../../../context/preferredUnitsContext"
import getFractionDigits from "../../../../utils/fractionConvertor"
import { Pressure, Temperature, UNew, Unit, UnitProps } from "js-ballistics/dist/v2"
import { Dialog, FAB, HelperText, Portal, TextInput } from "react-native-paper"
import { DoubleSpinBox, SpinBoxProps } from "../../../../components/widgets/doubleSpinBox"
import { useCalculator } from "../../../../context/profileContext"
import { RulerSlider } from "../../../../components/widgets/ruler/ruler"
import { StyleSheet } from "react-native"
import { NumericField } from "../../components"
import { DimensionProps } from "../../../../hooks/dimension"
import { useCurrentConditions } from "../../../../context/currentConditions"

interface ValueDialogProps {
    button: React.ReactElement;
    label: string;
    icon: string;
    enableSlider?: boolean;
    dimension: DimensionProps;
}


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
    button, label, icon, enableSlider = false, dimension
}) => {
    const [visible, setVisible] = useState(false);
    const [localValue, setLocalValue] = useState(dimension.asPref);
    const [localError, setLocalError] = useState<Error | null>(null);

    useEffect(() => {
        setLocalValue(dimension.asPref)
    }, [dimension])

    const showDialog = useCallback(() => {
        setVisible(true);
    }, []);

    const onSubmit = useCallback(() => {
        dimension.setAsPref(localValue)
        setVisible(false)
    }, [dimension, localValue]);

    const onDecline = useCallback(() => {
        setLocalValue(dimension.asPref)
        setVisible(false)
    }, [dimension, setLocalValue]);

    return (
        <>
            {React.cloneElement(button, { label: `${dimension.asString} ${dimension.symbol}`, onPress: showDialog })}
            <Portal>
                <Dialog visible={visible} onDismiss={onDecline} style={styles.dialog}>
                    <Dialog.Icon icon={icon} />
                    <Dialog.Title style={styles.dialogTitle}>{`${label}, ${dimension.symbol}`}</Dialog.Title>
                    <Dialog.Content style={styles.dialogContent}>
                        {/* {enableSlider && <ValueSlider fieldProps={fieldProps} value={localValue} onChange={setLocalValue} style={styles.slider} />} */}
                        <NumericField
                            label="" icon=""
                            dimension={dimension}
                            value={localValue}
                            onValueChange={setLocalValue}
                            onError={setLocalError}
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        {!localError && <FAB size="small" icon="check" mode="flat" variant="secondary" onPress={onSubmit} />}
                        <FAB size="small" icon="close" mode="flat" variant="tertiary" onPress={onDecline} />
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



const WeatherTemperatureDialog: React.FC<{ button: React.ReactElement }> = ({ button }) => {
    const { temperature } = useCurrentConditions()

    return (
        <ValueDialog
            button={button}
            label="Temperature"
            icon="thermometer"
            dimension={temperature}
            enableSlider
        />
    )
};


const WeatherPowderTemperatureDialog: React.FC<{ button: React.ReactElement }> = ({ button }) => {
    const { powderTemperature } = useCurrentConditions()

    return (
        <ValueDialog
            button={button}
            label="Powder temperature"
            icon="thermometer"
            dimension={powderTemperature}
            enableSlider
        />
    )
};


const WeatherPressureDialog: React.FC<{ button: React.ReactElement }> = ({ button }) => {
    const { pressure } = useCurrentConditions()

    return (
        <ValueDialog
            button={button}
            label="Pressure"
            icon="thermometer"
            dimension={pressure}
            enableSlider
        />
    )
};


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