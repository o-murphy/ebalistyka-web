import { StyleSheet } from "react-native";
import { ScreenBackground } from "../components";
import { HomeContent } from "../../mobile/homeScreen";
import { Surface } from "react-native-paper";
import { WeatherTopContainer } from "../../mobile/weatherScrreen";
import { ShotInfoContent } from "../../mobile/shotInfoScreen";
import { BotContainer, TopContainer } from "../../mobile/homeScreen/components";
import { useEffect } from "react";
import { useCurrentConditions } from "../../../context/currentConditions";
import { useCalculator } from "../../../context/profileContext";


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


const CurrentShot = () => {
    const { profileProperties, fire } = useCalculator();

    const currentConditions = useCurrentConditions();
    useEffect(() => {
        if (profileProperties && currentConditions) {
            fire();
        }
    }, [profileProperties, currentConditions]);

    return (
        <TileSurface style={styles.column} widthRatio={1} heightRatio={1}>
            <TopContainer />
        </TileSurface>
    );
}


const HomeScreen = ({ navigation }) => {
    return (
        <ScreenBackground>

            <Surface style={styles.surface} elevation={0}>

                <CurrentShot />

                <TileSurface style={styles.column} widthRatio={1} heightRatio={1}>
                    <Surface style={{ borderRadius: 32, overflow: "hidden" }} elevation={1}>
                        <WeatherTopContainer />
                    </Surface>
                </TileSurface>


                <TileSurface style={styles.column} widthRatio={1} heightRatio={1}>
                    <BotContainer />
                </TileSurface>

                <TileSurface style={styles.column} widthRatio={1} heightRatio={1}>
                    <ShotInfoContent />
                </TileSurface>
            </Surface>

        </ScreenBackground>
    )
}

const styles = StyleSheet.create({
    surface: {
        flexDirection: "row",
        flexWrap: "wrap",
        padding: 8,
        justifyContent: "flex-start",
        alignItems: "center",
        overflow: "hidden"
    },
    column: {
        margin: 8,
        padding: 16,
        borderRadius: 32,
        overflow: "hidden",
        alignSelf: "flex-start"
    },
    scrollView: {
        flex: 1,
        // paddingBottom: 32,  // not uses on HomeContent
    },
    scrollViewContainer: {
        // додаткові стилі для контейнера
    },
});

export default HomeScreen;
