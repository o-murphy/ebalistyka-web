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
import CustomCard from "../../../components/cards/customCard";
import { TopContainerFabsLabels } from "../../mobile/homeScreen/components/topContainer";


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
            <TopContainerFabsLabels />
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
        <CustomCard title={"Current conditions"} style={{ maxWidth: 400, maxHeight: 800 }}>
            <TopContainer />
            <WeatherTopContainer />
        </CustomCard>
    );
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

                <CustomCard title={"Hold"} style={{ maxWidth: 400, maxHeight: 800, overflow: "scroll" }}>
                    <BotContainer />
                </CustomCard>

                <CustomCard title={"Shot info"} style={{ minWidth: 400, maxHeight: 800 }}>
                    <ShotInfoContent />
                </CustomCard>

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
