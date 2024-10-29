import { ScrollView, StyleSheet } from "react-native";
import { useTheme } from "../../context/themeContext";
import { Text } from "react-native-paper";
import CurrentAtmoCard from "../../components/cards/currentAtmoCard";

export const WeatherScreen = ({ navigation }) => {
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
            <CurrentAtmoCard />
            <Text variant="displayLarge">
                Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder 
                Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder 
            </Text>
        </ScrollView>
    )
}