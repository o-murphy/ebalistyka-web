import { useProfile } from "../../../context/profileContext";
import MeasureFormField, { MeasureFormFieldProps } from "./measureField"


export interface ZeroHumidityFieldProps extends Omit<MeasureFormFieldProps, 'value' | 'suffix' | 'onValueChange'> { }


export const ZeroHumidityField: React.FC<ZeroHumidityFieldProps> = () => {
    const { profileProperties, updateProfileProperties } = useProfile();

    const fieldProps: Partial<MeasureFormFieldProps> = {
        fKey: "humidity",
        label: "Humidity",
        suffix: "%",
        icon: "water",
        fractionDigits: 0,
        step: 1,
        minValue: 0,
        maxValue: 100,
    }

    const value: number = profileProperties?.[fieldProps.fKey] ? profileProperties[fieldProps.fKey] : 0

    const onValueChange = (value: number): void => {
        return updateProfileProperties({
            [fieldProps.fKey]: value
        })
    }

    return (
        <MeasureFormField
        {...fieldProps}
        value={value}
        onValueChange={onValueChange}
    />
    )
}
