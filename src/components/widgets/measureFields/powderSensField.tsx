import { useProfile } from "../../../context/profileContext";
import MeasureFormField, { MeasureFormFieldProps } from "./measureField"


export interface PowderSensFieldProps extends Omit<MeasureFormFieldProps, 'value' | 'suffix' | 'onValueChange'> { }


export const PowderSensField: React.FC<PowderSensFieldProps> = () => {
    const { profileProperties, updateProfileProperties } = useProfile();

    const fieldProps: Partial<MeasureFormFieldProps> = {
        fKey: "cTCoeff",
        label: "Temperature sens.",
        suffix: "%/15°C",
        icon: "percent",
        fractionDigits: 2,
        step: 0.01,
        minValue: 0,
        maxValue: 100,
    }

    const value: number = profileProperties?.[fieldProps.fKey] ? profileProperties[fieldProps.fKey] / 1000 : 0

    const onValueChange = (value: number): void => {
        return updateProfileProperties({
            [fieldProps.fKey]: value * 1000
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
