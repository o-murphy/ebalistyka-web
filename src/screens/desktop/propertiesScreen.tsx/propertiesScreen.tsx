import { ScrollView, StyleSheet } from "react-native";
import { ScreenBackground } from "../components";
import WeaponCard from "../../../components/cards/weaponCard";
import ProjectileCard from "../../../components/cards/projectileCard";
import BulletCard from "../../../components/cards/bulletCard";
import ZeroAtmoCard from "../../../components/cards/zeroAtmoCard";



const PropertiesScreen = ({ navigation }) => {
    return (
        <ScreenBackground>
            <ScrollView
                style={{ flexDirection: "column", flex: 1, minWidth: 280, maxWidth: 360 }}
                keyboardShouldPersistTaps="always"
                alwaysBounceVertical={false}
                showsVerticalScrollIndicator={false}
            >
                <WeaponCard />
                <ProjectileCard />
                {/* <BulletCard /> */}
                {/* <ZeroAtmoCard /> */}
            </ScrollView>
        </ScreenBackground>
    )
}


const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    scrollViewContainer: {
    },
})


export default PropertiesScreen;