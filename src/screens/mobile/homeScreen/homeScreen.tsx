import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { TopContainer, BotContainer } from "./components";
import { useCalculator } from "../../../context/profileContext";
import { ScreenBackground, ScrollViewSurface } from "../components";
import { useCurrentConditions } from "../../../context/currentConditions";


export const HomeContent = () => {
    const { profileProperties, fire } = useCalculator();

    const currentConditions = useCurrentConditions(); 
    useEffect(() => {
        if (profileProperties && currentConditions) {
            fire();
        }
    }, [profileProperties, currentConditions]);

    return (
        <ScrollViewSurface 
            style={styles.scrollView}
            keyboardShouldPersistTaps="always"
            alwaysBounceVertical={false}
            showsVerticalScrollIndicator={true}
            surfaceStyle={styles.scrollViewContainer}
            elevation={0}
        >
            <TopContainer />
            <BotContainer />
        </ScrollViewSurface>
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
