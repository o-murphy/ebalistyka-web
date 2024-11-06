import { useEffect } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { TopContainer, BotContainer } from "./components";
import { useCalculator } from "../../../context/profileContext";


const HomeScreen = ({ navigation = null }) => {
    const theme = useTheme();
    const { profileProperties, currentConditions, fire } = useCalculator();

    useEffect(() => {
        if (profileProperties && currentConditions) {
            fire();
        }
    }, [profileProperties, currentConditions]);

    const _styles = {
        scrollView: {
            ...styles.scrollView,
            backgroundColor: theme.colors.surface,
        },
    };

    return (
        <ScrollView
            style={_styles.scrollView}
            keyboardShouldPersistTaps="always"
            alwaysBounceVertical={false}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={styles.scrollViewContainer}
        >
            <TopContainer />
            <BotContainer />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        flex: 1, 
        paddingBottom: 64, 
    },
    scrollViewContainer: {
        // додаткові стилі для контейнера
    },
});

export default HomeScreen;
