import { ScrollView, StyleSheet } from "react-native";
import { useTheme } from "../../context/themeContext";
import { Text } from "react-native-paper";

export const TrajectoryTableScreen = ({ navigation }) => {
    const { theme } = useTheme();

    const styles = StyleSheet.create({
        scrollViewContainer: {
            backgroundColor: theme.colors.background,
        },
    });

    return (
        <ScrollView
            style={styles.scrollViewContainer}
            keyboardShouldPersistTaps="always"
            alwaysBounceVertical={false}
            showsVerticalScrollIndicator={true}
        >
            <Text variant="displayLarge">
                Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder 
                Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder 
            </Text>
        </ScrollView>
    )
}