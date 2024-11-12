import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Dialog, FAB, HelperText, Portal, TextInput } from "react-native-paper"
import { ValueDialog, ValueDialogProps, ValueDialogStyles, ValueSlider } from "../../components";
import { DoubleSpinBox, SpinBoxProps } from "../../../../components/widgets/doubleSpinBox";
import { useCurrentConditions } from "../../../../context/currentConditions";


const ValueDialogHumidity: React.FC<Partial<ValueDialogProps>> = ({
    button, fieldKey, label, icon, autofocus = false, enableSlider = false
}) => {
    const { currentConditions, updateCurrentConditions } = useCurrentConditions();
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
            style: ValueDialogStyles.input,
            contentStyle: ValueDialogStyles.inputContent,
            right: <TextInput.Affix text={"%"} textStyle={ValueDialogStyles.affix} />,
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
                <Dialog visible={visible} onDismiss={hideDialog} style={ValueDialogStyles.dialog}>
                    <Dialog.Icon icon={icon} />
                    <Dialog.Title style={ValueDialogStyles.dialogTitle}>{label}</Dialog.Title>
                    <Dialog.Content style={ValueDialogStyles.dialogContent}>
                        <DoubleSpinBox value={localValue} onValueChange={setLocalValue} onError={setError} {...fieldProps} />
                        {error && <HelperText type="error" visible={!!error}>{error.message}</HelperText>}
                        {enableSlider && <ValueSlider fieldProps={fieldProps} value={localValue} onChange={setLocalValue} style={ValueDialogStyles.slider} />}
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