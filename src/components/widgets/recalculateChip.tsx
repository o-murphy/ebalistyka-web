import { Chip, Icon } from "react-native-paper"
import { useTheme } from "../../context/themeContext"
import { useProfile } from "../../context/profileContext"
import { StyleProp, View, ViewStyle } from "react-native"
import { ReactNode } from "react"


interface RecalculateChipProps {
    style?: StyleProp<ViewStyle>;
    visible?: boolean;
}


const RecalculateChip = ({ style = null, visible = false }: RecalculateChipProps): ReactNode => {

    const { theme } = useTheme()
    const { fire } = useProfile()

    return (
        visible && (
            <Chip icon={() => <Icon size={16} source={"reload"} color={theme.colors.tertiary} />}
                mode={"flat"}
                onPress={() => fire()}
                textStyle={{ color: theme.colors.tertiary }}
                style={[{ backgroundColor: theme.colors.onTertiary }, style]} // flex: 1, marginHorizontal: 4, 
            >
                Recalculate
            </Chip>

        )
    )
}

export default RecalculateChip;