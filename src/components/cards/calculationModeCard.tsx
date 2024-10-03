import { SegmentedButtons } from "react-native-paper";
import CustomCard from "./customCard";
import { DataToDisplay, TrajectoryMode, useCalculator } from "../../context/profileContext";
import { StyleSheet, View } from "react-native";

const CalculationModeCard = (cardStyle) => {
    const { trajectoryMode, setTrajectoryMode, dataToDisplay, setDataToDisplay } = useCalculator();

    const toggleTrajectoryMode = (value) => {
        setTrajectoryMode(value);
    };

    const toggleDisplayMode = (value) => {
        setDataToDisplay(value);
    };

    return (
        <CustomCard
            style={{ ...cardStyle }}
            title={
                <View style={styles.row}>
                    <SegmentedButtons
                        style={styles.segmentedButton}
                        value={trajectoryMode}
                        onValueChange={toggleTrajectoryMode}
                        buttons={[
                            {
                                value: TrajectoryMode.Zero,
                                label: "Zero trajectory"
                            },
                            {
                                value: TrajectoryMode.Adjusted,
                                label: "Adjusted trajectory"
                            }
                        ]}
                    />

                    <SegmentedButtons
                        style={styles.segmentedButton}
                        value={dataToDisplay}
                        onValueChange={toggleDisplayMode}
                        buttons={[
                            {
                                value: DataToDisplay.Table,
                                label: "Table"
                            },
                            {
                                value: DataToDisplay.Chart,
                                label: "Charts"
                            },
                            {
                                value: DataToDisplay.Reticle,
                                label: "Reticle"
                            },
                            {
                                value: DataToDisplay.DragModel,
                                label: "Drag model"
                            }
                        ]}
                    />
                </View>
            }
        />
    );
};

const styles = StyleSheet.create({
    row: { 
        flexDirection: "row", 
        flexWrap: "wrap",  // Enable wrapping when there's not enough space
        justifyContent: "center", 
        alignItems: "center", 
        marginVertical: 4, 
        width: '100%' 
    },
    segmentedButton: { 
        flex: 1,  // Allow the buttons to grow and shrink based on space
        flexBasis: 'auto',  // Allow flexibility for shrinking and wrapping
        marginHorizontal: 8, 
        marginVertical: 4,  // Add some space between the rows when wrapping occurs
        justifyContent: "center", 
        alignItems: "center" 
    }
});

export default CalculationModeCard;
