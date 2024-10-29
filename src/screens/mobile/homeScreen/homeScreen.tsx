import { ScrollView, StyleSheet } from "react-native";
import { useTheme } from "../../../context/themeContext";
import { TopContainer } from "./components/topContainer";
import { BotContainer } from "./components/botContainer";

export const HomeScreen = ({ navigation }) => {
    const { theme } = useTheme();

    const _styles = StyleSheet.create({
        scrollViewContainer: {
            flex: 1,
            backgroundColor: theme.colors.secondaryContainer,
        },
    });

    return (
        <ScrollView
            keyboardShouldPersistTaps="always"
            alwaysBounceVertical={false}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={_styles.scrollViewContainer}
        >
            <TopContainer />
            <BotContainer />
        </ScrollView>
    )
}

