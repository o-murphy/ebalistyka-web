import React from "react";
import { View, StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import DoubleSpinBox from "./doubleSpinBox";

export interface MeasureFormFieldProps {
  key: string;
  label: string;
  suffix: string;
  icon: string;
  value: number;
  maxValue: number;
  minValue: number;
  fractionDigits: number;
  step?: number;
  onValueChange?: (value: any) => void;
}

const MeasureFormField: React.FC<MeasureFormFieldProps> = ({
  label,
  suffix,
  icon,
  value,
  maxValue,
  minValue,
  fractionDigits: decimals,
  step,
  onValueChange,
}) => {

  return (
    <View style={styles.row}>
      {/* <Text style={[styles.column, { flex: 1 }, styles.label]}>{label}</Text> */}
      <DoubleSpinBox
        value={value}
        onValueChange={onValueChange ? onValueChange : null}
        fractionDigits={decimals}
        minValue={minValue}
        maxValue={maxValue}
        step={step ?? 1}
        style={[styles.doubleSpinBox]}
        inputProps={{
          // label: `${label}, ${suffix}`,
          label: label,
          mode: "outlined",
          dense: true,
          // ...inputStyles,
          right: <TextInput.Affix text={suffix} textStyle={inputSideStyles.affix} />,
          left: <TextInput.Icon icon={icon} size={iconSize} style={inputSideStyles.icon} />,
        }}
        strict={true}
      />
    </View>
  );
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

export const inputStyles = StyleSheet.create({
  style: {
    height: 24,
  },
  contentStyle: {
    // fontSize: 14,
    textAlign: "left",
  },
  outlineStyle: {},
  underlineStyle: {},
});

export const inputSideStyles = StyleSheet.create({
  affix: {
    // fontSize: 14,
  },
  icon: {},
});

// export const iconSize = 12;
export const iconSize = null;

export const styles = StyleSheet.create({
  column: {
    flex: 1,
    flexDirection: "row",
    marginHorizontal: 8,
  },
  row: {
    flex: 1,
    flexDirection: "row",
    marginVertical: 4,
    alignItems: "center",
  },
  doubleSpinBox: {
    // justifyContent: "center",
    flex: 1,
  },
  nameContainer: {
    flex: 1,
    // marginVertical: 4,
  },
  label: {
    // fontSize: 14,
  },
});
