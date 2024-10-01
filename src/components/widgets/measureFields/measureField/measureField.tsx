import React from "react";
import {  StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import {SpinBox, DoubleSpinBox, SpinBoxProps} from "../../spinBox/spinBox";


export interface MeasureFormFieldProps extends SpinBoxProps {
  key?: string;
  label?: string;
  suffix?: string;
  icon?: string;
  compact?: boolean;
}

const MeasureFormField: React.FC<MeasureFormFieldProps> = ({
  label = "",
  suffix = "",
  icon = "",
  value = 0,
  minValue = -65535,
  maxValue = 65535,
  fractionDigits = 1,
  step,
  onValueChange,
  compact = false,
}) => {

  const spinBoxProps: SpinBoxProps = {
    value: value,
    onValueChange: onValueChange ? onValueChange : null,
    minValue: minValue,
    maxValue: maxValue,
    step: step ?? 1,
    style: [styles.spinBox, { marginVertical: 8 }],
    inputProps: {
      label: !compact ? label : `${label}${suffix && `, ${suffix}`}`,
      mode: "outlined",
      dense: true,
      contentStyle: !compact ? {...styles.inputContentStyle} : {...styles.inputContentStyleCompact},
      right: !compact && <TextInput.Affix text={suffix} textStyle={inputSideStyles.affix} />,
      left: <TextInput.Icon icon={icon} size={iconSize} style={inputSideStyles.icon} />,
    }
  }

  return (
      fractionDigits <= 0 
      ? <SpinBox {...spinBoxProps}/>
      : <DoubleSpinBox {...spinBoxProps} />
  )
};

// Wrap in React.memo to prevent unnecessary re-renders
export default React.memo(MeasureFormField, (prevProps, nextProps) => {
  // Only re-render if relevant props (like value) have changed
  return (
    prevProps.value === nextProps.value &&
    prevProps.maxValue === nextProps.maxValue &&
    prevProps.minValue === nextProps.minValue &&
    prevProps.fractionDigits === nextProps.fractionDigits &&
    prevProps.step === nextProps.step &&
    prevProps.suffix === nextProps.suffix
  );
});

export const styles = StyleSheet.create({
  spinBox: {flex: 1},
  inputContentStyle: { paddingRight: 80, textAlign: "right"},
  inputContentStyleCompact: { textAlign: "right" },
  nameContainer: {
    flex: 1,
  },
})


export const inputSideStyles = StyleSheet.create({
  affix: {
    textAlign: "left"
  },
  icon: {},
});

// export const iconSize = 12;
export const iconSize = null;
