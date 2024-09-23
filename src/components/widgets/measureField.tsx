import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, TextInput } from "react-native-paper";
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

// interface MeasureFormFieldComponentProps {
//   field: MeasureFormFieldProps;
//   onValueChange?: (value: any) => void; 
// }

const MeasureFormField: React.FC<MeasureFormFieldProps> = ({
  key,
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
      <Text style={[styles.column, { flex: 1 }, styles.label]}>{label}</Text>
      <DoubleSpinBox
        key={key}
        value={value}
        onValueChange={onValueChange ? onValueChange : null}
        fractionDigits={decimals}
        minValue={minValue}
        maxValue={maxValue}
        step={step ?? 1}
        style={styles.doubleSpinBox}
        inputProps={{
          mode: "outlined",
          dense: true,
          ...inputStyles,
          right: <TextInput.Affix text={suffix} textStyle={inputSideStyles.affix} />,
          // left: <TextInput.Icon icon={field.icon} size={iconSize} style={inputSideStyles.icon} />,
        }}
      />
    </View>
  );
};

export const inputStyles = StyleSheet.create({
  style: {
    height: 24,
  },
  contentStyle: {
    fontSize: 14,
    textAlign: "left",
  },
  outlineStyle: {},
  underlineStyle: {},
});

export const inputSideStyles = StyleSheet.create({
  affix: {
    fontSize: 14,
  },
  icon: {},
});

export const iconSize = 12;

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
    justifyContent: "center",
    flex: 2,
  },
  nameContainer: {
    flex: 1,
    marginVertical: 4,
  },
  label: {
    fontSize: 14,
  },
});

export default MeasureFormField;
