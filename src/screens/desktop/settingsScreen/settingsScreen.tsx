import { SettingsContent } from "../../mobile/settingsScreen"
import { ScreenBackground } from "../components";
import { StyleSheet } from "react-native";
import { TileSurface } from "../homeScreen/homeScreen";
import { ScrollViewSurface } from "../../../components/widgets";


const SettingsScreen = () => {
    return (

        <ScreenBackground>

            {/* <Surface style={{ flex: 1, flexDirection: "row", flexWrap: "wrap", overflow: "scroll", padding: 8, justifyContent: "flex-start" }} elevation={0}> */}

            <ScrollViewSurface
                style={styles.scrollView}
                elevation={0}
                surfaceStyle={styles.surface}
            >
                <TileSurface heightRatio={2} widthRatio={1} style={styles.column}>
                    <SettingsContent />
                </TileSurface>
            </ScrollViewSurface>
            {/* </Surface> */}

        </ScreenBackground>
    )
}


const styles = StyleSheet.create({
    surface: {
        flex: 1,
        maxHeight: "100%",
        borderRadius: 16,
        overflow: "hidden",
    },
    column: {
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


export default SettingsScreen;