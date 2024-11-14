import { StyleSheet } from "react-native";
import { ScreenBackground } from "../components";
import WeaponCard from "../../../components/cards/weaponCard";
import ProjectileCard from "../../../components/cards/projectileCard";
import BulletCard from "../../../components/cards/bulletCard";
import ZeroAtmoCard from "../../../components/cards/zeroAtmoCard";
import { ScrollViewSurface } from "../../mobile/components";



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
                <ZeroAtmoCard />
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