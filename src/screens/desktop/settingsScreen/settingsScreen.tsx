import { Surface } from "react-native-paper";
import { SettingsContent } from "../../mobile/settingsScreen"
import { ScreenBackground } from "../components";
import { StyleSheet } from "react-native";
import { TileSurface } from "../homeScreen/homeScreen";



const SettingsScreen = () => {
    return (

        <ScreenBackground>

            <Surface style={{ flex: 1, flexDirection: "row", flexWrap: "wrap", overflow: "scroll", padding: 8, justifyContent: "flex-start" }} elevation={0}>

                <TileSurface style={styles.column} heightRatio={2}>
                    <SettingsContent />
                </TileSurface>
            </Surface>

        </ScreenBackground>
    )
}


const styles = StyleSheet.create({
    column: {
        flex: 1,
        minWidth: 320,
        maxWidth: 400,
        maxHeight: "100%",
        margin: 8,
        borderRadius: 32,
        overflow: "hidden",
    },
    scrollView: {
        flex: 1,
        // paddingBottom: 32,  // not uses on HomeContent
    },
    scrollViewContainer: {
        // додаткові стилі для контейнера
    },
});


export default SettingsScreen;