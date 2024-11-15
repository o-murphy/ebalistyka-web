import { Chip, Icon, ActivityIndicator, useTheme } from "react-native-paper"
import { useProfile } from "../../context"
import { StyleProp, ViewStyle } from "react-native"
import { ReactNode } from "react"


interface RecalculateChipProps {
  style?: StyleProp<ViewStyle>;
  visible?: boolean;
}


const RecalculateChip = ({ style = null, visible = false }: RecalculateChipProps): ReactNode => {
  const theme = useTheme();
  const { fire, inProgress } = useProfile();

  const iconSource = () => {
    return inProgress ? (
      <ActivityIndicator size={16} color={theme.colors.tertiary} />
    ) : (
      <Icon size={16} source={"reload"} color={theme.colors.tertiary} />
    );
  };

  return (
    visible && (
      <Chip
        icon={iconSource}
        mode={"flat"}
        onPress={() => fire()} // Call fire when pressed
        disabled={inProgress}  // Disable the chip while progress is ongoing
        textStyle={{ color: theme.colors.tertiary }}
        style={[{ backgroundColor: theme.colors.onTertiary }, style]} // You can modify the style further
      >
        {inProgress ? "Calculating..." : "Recalculate"}
      </Chip>
    )
  );
};


export default RecalculateChip;