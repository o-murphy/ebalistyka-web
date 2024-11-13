import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Dialog, FAB, Portal } from "react-native-paper"
import { RulerSlider } from "../../../components/widgets/ruler/ruler"
import NumericField from "./numericField"
import { DimensionProps } from "../../../hooks/dimension"
import { StyleSheet } from "react-native"
import { DeviceType } from "expo-device";
import useDeviceType from "../../../hooks/deviceType"


interface ValueDialogProps {
    button: React.ReactElement;
    label: string;
    icon: string;
    enableSlider?: boolean;
    dimension: DimensionProps;
}


const ValueSlider = ({ dimension, value, onChange, style = null }) => {
    const scrollWheelProps = useMemo(() => ({
        minValue: dimension.min,
        maxValue: dimension.max,
        width: 200,
        height: 350,
        fraction: dimension.accuracy,
        step: 1,
        onChange
    }), [dimension]);

    return <RulerSlider {...scrollWheelProps} value={value} style={style} />;
};

const ValueDialog: React.FC<ValueDialogProps> = ({
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
                        <NumericField
                            label="" icon=""
                            dimension={dimension}
                            value={localValue}
                            onValueChange={setLocalValue}
                            onError={setLocalError}
                        />
                        {showSlider && <ValueSlider dimension={dimension} value={localValue} onChange={setLocalValue} style={styles.slider} />}

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


export {
    ValueDialogProps,
    ValueDialog,
    ValueSlider,
    styles as ValueDialogStyles
};