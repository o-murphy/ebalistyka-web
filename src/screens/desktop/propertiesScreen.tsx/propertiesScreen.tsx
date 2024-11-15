import { StyleSheet } from "react-native";
import { ScreenBackground } from "../components";
import { WeaponCard, ProjectileCard, BulletCard, WeatherCard } from "../../../components/cards";
import { ScrollViewSurface } from "../../../components/widgets";


const PropertiesScreen = ({ navigation }) => {
    return (
        <ScreenBackground>
            <ScrollViewSurface
                style={styles.scrollView}
                elevation={0}
                surfaceStyle={styles.surface}
            >
                <WeaponCard />
                <ProjectileCard />
                <BulletCard />
                <WeatherCard />
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


export default PropertiesScreen;