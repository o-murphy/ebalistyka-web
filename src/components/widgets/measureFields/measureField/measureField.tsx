import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text, FAB, TextInput, Tooltip } from "react-native-paper";
import { DoubleSpinBox, SpinBoxProps } from "../../doubleSpinBox";
import { useTheme } from "../../../../context/themeContext";
import { useCalculator } from "../../../../context/profileContext";
import { fontConfig } from "react-native-paper/src/styles/fonts";


export interface MeasureFormFieldProps extends SpinBoxProps {
  fKey?: string;
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
    fractionDigits: fractionDigits,
    step: step ?? 1,
    style: [styles.spinBox, { marginVertical: 4 }],
    inputProps: {
      label: !compact ? label : `${label}${suffix && `, ${suffix}`}`,
      mode: "outlined",
      dense: true,
      contentStyle: !compact ? { ...styles.inputContentStyle } : { ...styles.inputContentStyleCompact },
      right: !compact && <TextInput.Affix text={suffix} textStyle={inputSideStyles.affix} />,
      left: <TextInput.Icon icon={icon} size={iconSize} style={inputSideStyles.icon} />,
    },
    strict: true
  }

  return (
    <DoubleSpinBox {...spinBoxProps} />
  )
};


interface MeasureFormFieldRefreshableProps {
  fieldProps: Partial<MeasureFormFieldProps>;
  value: number;
  onValueChange: (value: number) => void;
  refreshable: boolean;
  buttonPosition?: "left" | "right"
}

export const RefreshFAB = ({ visible, style = null }) => {
  const { fire } = useCalculator()

  return (
    <Tooltip title="Recalculate" enterTouchDelay={0} leaveTouchDelay={0} >
      <FAB
        visible={visible}
        style={[
          {
            alignSelf: "center",
          }, style
        ]}
        size={"small"}
        icon={"reload"}
        onPress={() => fire()}
        variant="tertiary"
      />
    </Tooltip>
  )
}

export const MeasureFormFieldRefreshable = ({ fieldProps, value, onValueChange, refreshable, buttonPosition = "right" }) => {
  const refreshFabStyle = {
    left: {marginVertical: 4, marginRight: 4},
    right: {marginVertical: 4, marginLeft: 4}
  }
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {buttonPosition === "left" && refreshable && <RefreshFAB visible={refreshable} style={refreshFabStyle.left}/>}
      <MeasureFormField
        {...fieldProps}
        value={value}
        onValueChange={onValueChange}
      />
      {buttonPosition === "right" && refreshable && <RefreshFAB visible={refreshable} style={refreshFabStyle.right}/>}
    </View>
  )
}

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
  spinBox: { flex: 1 },
  inputContentStyle: { paddingRight: 60, textAlign: "right" },
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
export const iconSize = 20;
