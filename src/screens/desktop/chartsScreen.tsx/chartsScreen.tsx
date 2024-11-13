import { StyleSheet } from "react-native";
import { ScrollViewSurface } from "../../mobile/components";
import { ScreenBackground } from "../components";
import { Surface } from "react-native-paper";
import { HorizontalTrajectoryChart, HorizontalWindageChart } from "../../../components/widgets/trajectoryData";


export const ChartsContent = () => {
    return (
        <Surface style={{ flex: 1 }} elevation={0}>
            <Surface
                style={{
                    flex: 1,
                    padding: 16,
                    margin: 16,
                    maxWidth: 800,
                    maxHeight: 800,
                    minWidth: 600,
                    borderRadius: 16
                }}
                elevation={1}
            >
                <ScrollViewSurface
                    style={{ flex: 1 }}
                    surfaceStyle={{ paddingBottom: 16 }}
                    elevation={0}
                >
                    <HorizontalTrajectoryChart />
                    <HorizontalWindageChart />
                </ScrollViewSurface>
            </Surface>
        </Surface>
    )
}


const ChartsScreen = ({ navigation }) => {
    return (
        <ScreenBackground>
            <ChartsContent />
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


export default ChartsScreen;