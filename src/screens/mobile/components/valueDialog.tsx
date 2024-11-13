import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Dialog, FAB, Portal } from "react-native-paper"
import { RulerSlider } from "../../../components/widgets/ruler/ruler"
import { DimensionField, NumericField } from "./numericField"
import { DimensionProps, NumeralProps } from "../../../hooks/dimension"
import { StyleProp, StyleSheet, ViewStyle } from "react-native"
import { DeviceType } from "expo-device";
import useDeviceType from "../../../hooks/deviceType"


export interface DimensionDialogProps {
    button: React.ReactElement;
    label: string;
    icon: string;
    enableSlider?: boolean;
    dimension: DimensionProps;
}


export interface NumericDialogProps {
    button: React.ReactElement;
    label: string;
    icon: string;
    enableSlider?: boolean;
    numeral: NumeralProps;
}


export interface DimensionSliderProps {
    dimension: DimensionProps;
    value: number;
    onChange: (value: number) => void;
    style: StyleProp<ViewStyle>;
}

export interface NumericSliderProps {
    value: number;
    onChange: (value: number) => void;
    style: StyleProp<ViewStyle>;
    numeral: NumeralProps;
}




export const DimensionSlider: React.FC<DimensionSliderProps> = ({ dimension, value, onChange, style = null }) => {
    const scrollWheelProps = useMemo(() => ({
        minValue: dimension.rangePref.min,
        maxValue: dimension.rangePref.max,
        width: 200,
        height: 350,
        fraction: dimension.accuracy,
        step: 1,
        onChange
    }), [dimension]);

    return <RulerSlider {...scrollWheelProps} value={value} style={style} />;
};


export const NumericSlider: React.FC<NumericSliderProps> = ({ value, onChange, style = null, numeral }) => {
    const scrollWheelProps = useMemo(() => ({
        minValue: numeral.range.min,
        maxValue: numeral.range.max,
        width: 200,
        height: 350,
        fraction: numeral.range.accuracy,
        step: 1,
        onChange
    }), [numeral]);

    return <RulerSlider {...scrollWheelProps} value={value} style={style} />;
};

export const DimensionDialog: React.FC<DimensionDialogProps> = ({
    button, label, icon, enableSlider = false, dimension
}) => {
    const [visible, setVisible] = useState(false);
    const [localValue, setLocalValue] = useState(dimension.asPref);
    const [localError, setLocalError] = useState<Error | null>(null);

    const [showSlider, setShowSlider] = useState(false)

    const deviceType = useDeviceType()

    useEffect(() => {
        setShowSlider((deviceType === DeviceType.PHONE || deviceType === DeviceType.TABLET) && enableSlider);
    }, []);

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
                        <DimensionField
                            label="" icon=""
                            dimension={dimension}
                            value={localValue}
                            onValueChange={setLocalValue}
                            onError={setLocalError}
                        />
                        {showSlider && <DimensionSlider dimension={dimension} value={localValue} onChange={setLocalValue} style={styles.slider} />}

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



export const NumericDialog: React.FC<NumericDialogProps> = ({
    button, label, icon, enableSlider = false, numeral
}) => {
    const [visible, setVisible] = useState(false);
    const [localValue, setLocalValue] = useState(numeral.value);
    const [localError, setLocalError] = useState<Error | null>(null);

    const [showSlider, setShowSlider] = useState(false)

    const deviceType = useDeviceType()

    useEffect(() => {
        setShowSlider((deviceType === DeviceType.PHONE || deviceType === DeviceType.TABLET) && enableSlider);
    }, []);

    useEffect(() => {
        setLocalValue(numeral.value)
    }, [numeral])

    const showDialog = useCallback(() => {
        setVisible(true);
    }, []);

    const onSubmit = useCallback(() => {
        numeral.setValue(localValue)
        setVisible(false)
    }, [numeral, localValue]);

    const onDecline = useCallback(() => {
        setLocalValue(numeral.value)
        setVisible(false)
    }, [numeral, setLocalValue]);

    return (
        <>
            {React.cloneElement(button, { label: `${numeral.value.toFixed(numeral.range.accuracy)} ${numeral.symbol}`, onPress: showDialog })}
            <Portal>
                <Dialog visible={visible} onDismiss={onDecline} style={styles.dialog}>
                    <Dialog.Icon icon={icon} />
                    <Dialog.Title style={styles.dialogTitle}>{`${label}, ${numeral.symbol}`}</Dialog.Title>
                    <Dialog.Content style={styles.dialogContent}>
                        <NumericField
                            label="" icon=""
                            numeral={numeral}
                            value={localValue}
                            onValueChange={setLocalValue}
                            onError={setLocalError}
                        />
                        {showSlider && <NumericSlider numeral={numeral} value={localValue} onChange={setLocalValue} style={styles.slider} />}

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

export {styles as ValueDialogStyles};