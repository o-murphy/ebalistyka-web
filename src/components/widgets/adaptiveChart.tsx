import { LineChart } from 'react-native-chart-kit';
import { useState } from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';


// Arrow function component
const CustomChart = ({containerStyle, data, chartProps}) => {

    const theme = useTheme();
    const [containerWidth, setContainerWidth] = useState(0);

    return (
        <View
            style={containerStyle}
            onLayout={(event) => {
                const { width } = event.nativeEvent.layout; // Get container width
                setContainerWidth(width); // Set the width of the container
            }}
        >
            {containerWidth > 0 && ( // Only render the chart once the width is known
                <LineChart
                    style={{ alignSelf: "center" }}
                    data={data}
                    width={containerWidth}
                    chartConfig={{ ...chartConfig, color: () => theme.colors.onSurface }}
                    fromZero={true}
                    {...chartProps}
                />
            )}
        </View>
    );
};


const chartConfig = {

    backgroundGradientFrom: "#000000",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#000000",
    backgroundGradientToOpacity: 0,

    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional

    style: {
        borderRadius: 16
    },
};


export default CustomChart;