import { StyleSheet } from "react-native";
import { ScreenBackground } from "../components";
import { Surface } from "react-native-paper";
import { WeatherTopContainer } from "../../mobile/weatherScrreen";
import { ShotInfoContent } from "../../mobile/shotInfoScreen";
import { BotContainer, TopContainerFabs } from "../../mobile/homeScreen/components";
import { useEffect } from "react";
import { useCurrentConditions } from "../../../context/currentConditions";
import { useProfile } from "../../../context/profileContext";
import { ScrollViewSurface } from "../../mobile/components";
import ProfileTitle from "../../mobile/homeScreen/components/profileTitle";
import ShotPropertiesContainer from "../../mobile/homeScreen/components/shotProperties";
import { useCalculator } from "../../../context/calculatorContext";


const TILE_BASE_SIZE = 400;

export const TileSurface = ({ children, widthRatio = 1, heightRatio = 1, style = null, ...props }) => {
    return (
        <Surface style={[
            {
                width: widthRatio * TILE_BASE_SIZE,
                height: heightRatio * TILE_BASE_SIZE,
                minWidth: widthRatio * TILE_BASE_SIZE,
                minHeight: heightRatio * TILE_BASE_SIZE,
                maxWidth: widthRatio * TILE_BASE_SIZE,
                maxHeight: heightRatio * TILE_BASE_SIZE,
            },
            style,
        ]} {...props}>
            {children}
        </Surface>
    )
}


const CurrentWeather = () => {
    return (
        <TileSurface style={styles.column} widthRatio={1} heightRatio={1}>
            <Surface style={{ borderRadius: 16, overflow: "hidden" }} elevation={1}>
                <WeatherTopContainer />
            </Surface>
        </TileSurface>
    )
}


const TopContainer = () => {

    return (
        <Surface style={{
            minHeight: 320,
            minWidth: 320,
            aspectRatio: 1,
            padding: 8,
            borderBottomRightRadius: 16,
            borderBottomLeftRadius: 16,
        }} elevation={1}>
            <ProfileTitle />
            <ShotPropertiesContainer />
            <TopContainerFabs />
        </Surface>
    );
};


const CurrentShot = () => {
    const { fire } = useCalculator()
    const profileProperties = useProfile();

    const currentConditions = useCurrentConditions();

    useEffect(() => {
        if (profileProperties && currentConditions) {
            fire();
        }
    }, [
        currentConditions,
        profileProperties
    ]);

    return (
        <TileSurface style={styles.column} widthRatio={1} heightRatio={2}>
            <TopContainer />
            <BotContainer />
        </TileSurface>
    );
}

const ShotInfo = () => {
    return (
        <TileSurface style={styles.column} widthRatio={1} heightRatio={2}>
            <ShotInfoContent />
        </TileSurface>
    )
}


const HomeScreen = ({ navigation }) => {
    return (
        <ScreenBackground>
            <ScrollViewSurface
                style={styles.scrollView}
                elevation={0}
                surfaceStyle={styles.surface}
            >
                <CurrentShot />
                <CurrentWeather />
                <ShotInfo />
            </ScrollViewSurface>
        </ScreenBackground>
    )
}

const styles = StyleSheet.create({
    surface: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    column: {
        // margin: 8,
        marginBottom: 16,
        marginRight: 16,
        borderRadius: 16,
        overflow: "hidden",
        alignSelf: "flex-start"
    },
    scrollView: {
        flex: 1,
        margin: 16
        // paddingBottom: 32,  // not uses on HomeContent
    },
    scrollViewContainer: {
        // додаткові стилі для контейнера
    },
});

export default HomeScreen;
