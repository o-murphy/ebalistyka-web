import { StyleSheet } from 'react-native';
import { useProfile } from '../../../context/profileContext';
import { Text } from 'react-native-paper';
import CustomChart from '../adaptiveChart';
import { Table } from 'js-ballistics/dist/v2';


const DragChart = () => {

    const { calculator, profileProperties } = useProfile()

    // const dragTable = calculator?.ammo?.dm?.dragTable

    if (!profileProperties || !calculator) return null;

    let dragTable = null;
    
    switch (profileProperties?.bcType) {
        case "G1":
            dragTable = Table.G1;
            break;
        case "G7":
            dragTable = Table.G7;
            break;
        default:
            break;
    }

    const customDragTable = calculator?.calc?.cdm

    const data = {
        labels: customDragTable.map(row => row.Mach),
        datasets: [
            // Conditionally add the dragTable dataset only if it exists
            ...(dragTable ? [{
                data: dragTable.map(row => row.CD),
                color: () => "blue" // You can specify a color here if needed
            }] : []),
            {
                data: customDragTable.map(row => row.CD),
                color: () => "orange"
            }
        ],
        legend: [
            // Conditionally add the "Standard" legend only if dragTable exists
            ...(dragTable ? ["Standard"] : []),
            "Calculated"
        ]
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