import { StyleSheet } from "react-native";
import { ScreenBackground } from "../components";
import { Surface } from "react-native-paper";
import { DragChart, HorizontalTrajectoryChart, HorizontalWindageChart } from "../../../components/widgets/trajectoryData";
import CustomCard from "../../../components/cards/customCard";
import { ScrollViewSurface } from "../../../components/widgets";


export const ChartsContent = () => {
    return (
        <ScrollViewSurface
            style={styles.scrollView}
            elevation={0}
            surfaceStyle={styles.surface}
        >

            <Surface style={styles.column} elevation={0}>

                <CustomCard title={"Trajectory"} style={{ minWidth: 720 }}>
                    <HorizontalTrajectoryChart />
                </CustomCard>

                <CustomCard title={"Windage"} style={{ minWidth: 720 }}>
                    <HorizontalWindageChart />
                </CustomCard>

            </Surface>

            <Surface style={styles.column} elevation={0}>

                <CustomCard title={"Drag model"} style={{ minWidth: 720 }}>
                    <DragChart />
                </CustomCard>

            </Surface>


        </ScrollViewSurface>
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
    surface: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    column: {
        flexDirection: "column",
        flexWrap: "wrap",
    },
    scrollView: {
        flex: 1,
        margin: 16
    },
    scrollViewContainer: {
        // додаткові стилі для контейнера
    },
});


export default ChartsScreen;