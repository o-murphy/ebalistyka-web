import { ScrollView, StyleSheet } from "react-native";
import { useTheme } from "../../../context/themeContext";
import { TopContainer } from "./components/topContainer";
import { BotContainer } from "./components/botContainer";
import { styles } from "../../../components/widgets/measureFields/measureField/measureField";
import { useCalculator } from "../../../context/profileContext";
import { useEffect } from "react";

export const HomeScreen = ({ navigation }) => {
    const { theme } = useTheme();
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

