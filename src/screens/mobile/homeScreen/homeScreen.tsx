import { useEffect } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { TopContainer, BotContainer } from "./components";
import { useCalculator } from "../../../context/profileContext";
import { ScreenBackground } from "../components";


const HomeContent = () => {
    const theme = useTheme();
    const { profileProperties, currentConditions, fire } = useCalculator();

    useEffect(() => {
        if (profileProperties && currentConditions) {
            fire();
        }
    }, [profileProperties, currentConditions]);

    return (
        <ScrollView
            style={[styles.scrollView, {backgroundColor: theme.colors.surface}]}
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


const HomeScreen = ({navigation}) => {
    return (
        <ScreenBackground>
            <HomeContent />
        </ScreenBackground>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1, 
        // paddingBottom: 32,  // not uses on HomeContent
    },
    scrollViewContainer: {
        // додаткові стилі для контейнера
    },
});

export default HomeScreen;
