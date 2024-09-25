import {
    preferredUnits, Unit
} from 'js-ballistics/dist/v2';
import { StyleSheet } from 'react-native';
import { useProfile } from '../../context/profileContext';
import { Text } from 'react-native-paper';
import { useTheme } from '../../context/themeContext';
import CustomChart from './adaptiveChart';


const DragChart = () => {

    const { hitResult } = useProfile()

    if (hitResult instanceof Error) return (
        <Text>Can't display chart</Text>
    );

    const dragTable = hitResult.shot.ammo.dm.dragTable

    const data = {
        labels: dragTable.map(row => row.Mach),
        datasets: [
            // {
            //     data: result.map(row => row.drag),
            // },
            {
                data: dragTable.map(row => row.CD),
            }
        ],
        legend: [
            "Drag",
        ],
    };

    const formatLabel = (value) => {
        const decimalPart = value % 1
        if ([0.75, 0.5, 0.25, 0].includes(decimalPart)) {
            return value
        } else {
            return ""
        }
    }

    return (
        <CustomChart containerStyle={styles.customChart} data={data} 
            chartProps={{
                height: 240,
                yAxisInterval: 100,
                // verticalLabelRotation: -90,
                // xLabelsOffset: 25,
                formatXLabel: formatLabel
                // formatXLabel: (value) => (Math.floor(parseFloat(value)) != parseFloat(value) ? "" : value)
            }}
        />
    )
};

const styles = StyleSheet.create({
    customChart: {
        // flex: 1, justifyContent: "center"
    }
})

export default DragChart;