import { ScrollView, StyleSheet } from "react-native";
import { TopContainer } from "./components/topContainer";
import { BotContainer } from "./components/botContainer";
import { useCalculator } from "../../../context/profileContext";
import { useEffect } from "react";
import { useTheme } from "react-native-paper";

export const HomeScreen = ({ navigation = null }) => {
    const theme = useTheme();
    const { profileProperties, currentConditions, fire } = useCalculator()

    useEffect(() => {
        if (profileProperties && currentConditions) {
            fire()
        }
    }, [profileProperties, currentConditions])

    const _styles = StyleSheet.create({
        scrollView: {
            flex: 1, 
            paddingBottom: 64, 
            backgroundColor: theme.colors.secondaryContainer
        },
        scrollViewContainer: {
            // backgroundColor: theme.colors.secondaryContainer
        },
    });

    return (
        <ScrollView
            style={_styles.scrollView}
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

