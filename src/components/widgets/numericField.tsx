import React, { useMemo, useState } from "react"
import { HelperText, Surface, TextInput } from "react-native-paper"
import { DimensionProps, NumeralProps } from "../../hooks"
import { DoubleSpinBox, SpinBoxProps } from "./doubleSpinBox";
import { StyleSheet, View } from "react-native";



export interface NumericFieldProps {
    numeral: NumeralProps;
    value: number;
    onValueChange: (value: number) => void;
    onError: (err: any) => void;
    label: string;
    icon: string;
}

export interface DimensionFieldProps {
    dimension: DimensionProps;
    value: number;
    onValueChange: (value: number) => void;
    onError: (err: any) => void;
    label: string;
    icon: string;
}


export const NumericField: React.FC<NumericFieldProps> = (
    { numeral, value, onValueChange, onError, label, icon }
) => {
    const [localError, setLocalError] = useState(null)

    const setErr = (err) => {
        setLocalError(err)
        onError(err)
    }

    const spinBoxProps: SpinBoxProps = useMemo(() => ({

        strict: true,
        onError: setErr,
        onValueChange: onValueChange,
        minValue: numeral.range.min,
        maxValue: numeral.range.max,
        fractionDigits: numeral.range.accuracy,
        step: 1 / (10 ** numeral.range.accuracy),
        inputProps: {
            label: label && `${label}, ${numeral.symbol}`,
            mode: "outlined",
            dense: true,
            style: styles.inputStyle,
            contentStyle: { ...styles.inputContentStyle },
            right: <TextInput.Affix text={numeral.symbol} textStyle={inputSideStyles.affix} />,
            left: <TextInput.Icon icon={icon} style={inputSideStyles.icon} />,
        },
    }), [numeral])

    return (
        <Surface style={{ maxWidth: "100%", marginVertical: 8 }} elevation={0}>
            <DoubleSpinBox {...spinBoxProps} value={value} />
            {localError && <HelperText type="error" visible={!!localError}>
                {localError.message}
            </HelperText>}
        </Surface>
    )
}


export const DimensionField: React.FC<DimensionFieldProps> = (
    { dimension, value, onValueChange, onError, label, icon }
) => {

    const [localError, setLocalError] = useState(null)

    const setErr = (err) => {
        setLocalError(err)
        onError(err)
    }

    const spinBoxProps: SpinBoxProps = useMemo(() => ({

        strict: true,
        onError: setErr,
        onValueChange: onValueChange,
        minValue: dimension.rangePref.min,
        maxValue: dimension.rangePref.max,
        fractionDigits: dimension.rangePref.accuracy,
        step: 1 / (10 ** dimension.rangePref.accuracy),
        inputProps: {
            label: label && `${label}, ${dimension.symbol}`,
            mode: "outlined",
            dense: true,
            style: styles.inputStyle,
            contentStyle: { ...styles.inputContentStyle },
            right: <TextInput.Affix text={dimension.symbol} textStyle={inputSideStyles.affix} />,
            left: <TextInput.Icon icon={icon} style={inputSideStyles.icon} />,
        },
    }), [dimension])

    return (
        <Surface style={{ maxWidth: "100%", marginVertical: 8 }} elevation={0}>
            <DoubleSpinBox {...spinBoxProps} value={value} />
            {localError && <HelperText type="error" visible={!!localError}>
                {localError.message}
            </HelperText>}
        </Surface>
    )
}


const styles = StyleSheet.create({
    inputStyle: {
        flex: 1
    },
    inputContentStyle: {
        paddingRight: 60,
        textAlign: "right"
    },
})


const inputSideStyles = StyleSheet.create({
    affix: {
        textAlign: "left"
    },
    icon: {},
});
