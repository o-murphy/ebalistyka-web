import { preferredUnits } from 'js-ballistics/dist/v2';
import { useProfile } from '../../context/profileContext';
import { Text } from 'react-native-paper';
import CustomChart from './adaptiveChart';
import { StyleSheet } from 'react-native';


const WindageChart = () => {

    const { hitResult } = useProfile()

    if (hitResult instanceof Error) return (
        <Text>Can't display chart</Text>
    );

    const result = hitResult.trajectory;

    const data = {
        labels: result.map((row) => row.distance.In(preferredUnits.distance).toFixed(0)),
        datasets: [
            {
                data: result.map((row) => row.windage.In(preferredUnits.drop)),
            },
        ],
        legend: ["Windage",],
    };

    return (
        <CustomChart containerStyle={styles.customChart} data={data} 
            chartProps={{
                height: 240,
                verticalLabelRotation: -90,
                xLabelsOffset: 20,
            }}
        />
    )
};

const styles = StyleSheet.create({
    customChart: {
        // flex: 1, justifyContent: "center"
    }
})

export default WindageChart;