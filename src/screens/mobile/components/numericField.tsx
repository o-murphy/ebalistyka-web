import React, { useMemo, useState } from "react"
import MeasureFormField, { MeasureFormFieldProps } from "../../../components/widgets/measureFields/measureField"
import { HelperText, Surface } from "react-native-paper"
import { DimensionProps } from "../../../hooks/dimension"


export interface NumericFieldProps {
    dimension: DimensionProps;
    value: number;
    onValueChange: (value: number) => void;
    onError: (err: any) => void;
    label: string;
    icon: string;
}


const NumericField: React.FC<NumericFieldProps> = (
    { dimension, value, onValueChange, onError, label, icon }
) => {

    const fieldProps: Partial<MeasureFormFieldProps> = useMemo(() => ({
        label: label,
        icon: icon,
        fractionDigits: dimension.rangePref.accuracy,
        step: 1 / (10 ** dimension.rangePref.accuracy),
        suffix: dimension.symbol,
        minValue: dimension.rangePref.min,
        maxValue: dimension.rangePref.max,
    }), [dimension])

    const [localError, setLocalError] = useState(null)

    const setErr = (err) => {
        setLocalError(err)
        onError(err)
    }

    return (
        <Surface style={{ marginVertical: 8 }} elevation={0}>
            <MeasureFormField
                {...fieldProps}
                value={value}
                onValueChange={onValueChange}
                onError={setErr}
                strict={false}
            />
            {localError && <HelperText type="error" visible={!!localError}>
                {localError.message}
            </HelperText>}
        </Surface>
    )
}


export default NumericField;