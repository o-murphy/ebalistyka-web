import React, { useEffect, useState } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { TextInput, HelperText } from "react-native-paper";
import { DoubleSpinBox, SpinBoxProps } from "../../doubleSpinBox";
import { RefreshFabState, RefreshFAB } from "../../refreshFAB";
import { useProfile } from "../../../../context/profileContext";

export interface MeasureFormFieldProps extends SpinBoxProps {
  fKey?: string;
  label?: string;
  suffix?: string;
  icon?: string;
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
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
  onError,
}) => {

  const spinBoxProps: SpinBoxProps = {
    value: value,
    onValueChange: onValueChange,
    strict: true,
    onError: onError,
    minValue: minValue,
    maxValue: maxValue,
    fractionDigits: fractionDigits,
    step: step ?? 1,
    inputProps: {
      label: !compact ? label : `${label}${suffix && `, ${suffix}`}`,
      mode: "outlined",
      dense: true,
      style: styles.inputStyle,
      contentStyle: !compact ? { ...styles.inputContentStyle } : { ...styles.inputContentStyleCompact },
      right: !compact && <TextInput.Affix text={suffix} textStyle={inputSideStyles.affix} />,
      left: <TextInput.Icon icon={icon} /* size={20} */ style={inputSideStyles.icon} />,
    },
  }

  return (
      <DoubleSpinBox {...spinBoxProps} />
  )
};


interface MeasureFormFieldRefreshableProps {
  fieldProps: Partial<MeasureFormFieldProps>;
  value: number;
  onValueChange?: (value: number) => void;
  onError?: (value: Error) => void;
  refreshable: boolean;
  buttonPosition?: "left" | "right"
}





export const MeasureFormFieldRefreshable: React.FC<MeasureFormFieldRefreshableProps> = (
  { fieldProps, value, onValueChange, onError, refreshable, buttonPosition = "right" }
) => {
  const [error, setError] = useState<Error>(null)
  const { updMeasureErr } = useProfile()
  
  const getFabState = () => {
    if (!refreshable && !error) {
      return RefreshFabState.Actual
    } else if (error) {
      return RefreshFabState.Error
    } else {
      return RefreshFabState.Updated
    }
  }

  const onErrorSet = (error: Error) => {
    setError(error)
    onError?.(error)
  }


  useEffect(() => {
    updMeasureErr({fkey: fieldProps.fKey, isError: !!error})
  }, [error])



  const fabState = getFabState()
  
  return (
    <View style={[styles.column, ]}>
      <View style={[styles.row, styles.center]}>
        {buttonPosition === "left" && fabState !== RefreshFabState.Actual && <RefreshFAB state={getFabState()} style={styles.fabLeft}/>}
        <MeasureFormField
          {...fieldProps}
          value={value}
          onValueChange={onValueChange}
          onError={onErrorSet}
        />
        {buttonPosition === "right" && fabState !== RefreshFabState.Actual && <RefreshFAB state={getFabState()} style={styles.fabRight}/>}
      </View>
      {error && <HelperText type="error" visible={!!error}>
        {error.message}
      </HelperText>}
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
  inputStyle: {flex: 1},
  inputContentStyle: { paddingRight: 60, textAlign: "right" },
  inputContentStyleCompact: { textAlign: "right" },

  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  row: { flexDirection: "row", marginVertical: 4 }, 
  column: { flexDirection: "column" },

  fabLeft: { marginRight: 4 },
  fabRight: { marginLeft: 4 }
})


export const inputSideStyles = StyleSheet.create({
  affix: {
    textAlign: "left"
  },
  icon: {},
});
