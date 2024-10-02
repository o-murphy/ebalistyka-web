import { SegmentedButtons, Text } from "react-native-paper";
import CustomCard from "./customCard";
import { DataToDisplay, TrajectoryMode, useProfile } from "../../context/profileContext";
import { StyleSheet, View } from "react-native";


const CalculationModeCard = (cardStyle) => {
    const { trajectoryMode, setTrajectoryMode, dataToDisplay, setDataToDisplay } = useProfile();

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
                    {/* <Text variant="bodyLarge" style={{ ...styles.column }}>
                        {"Calculation mode"}
                    </Text> */}
                    <SegmentedButtons
                        style={[styles.row, styles.switch]}
                        value={trajectoryMode}
                        onValueChange={toggleTrajectoryMode}
                        buttons={[
                            {
                                value: TrajectoryMode.Horizontal,
                                label: "Horizontal trajectory"
                            },
                            {
                                value: TrajectoryMode.Relative,
                                label: "Relative trajectory"
                            }
                        ]}
                    />
                </View>
            }
        >
            <SegmentedButtons
                style={styles.row}
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
        </CustomCard>
    );
};

const styles = StyleSheet.create({
    row: { flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 4, width: '100%' },
    column: { flexDirection: "column", marginHorizontal: 8 },
    switch: { marginLeft: 'auto' } // Вирівняти кнопку вправо
});

export default CalculationModeCard;
