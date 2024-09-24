import { LineChart } from 'react-native-chart-kit';

import {
    preferredUnits
} from 'js-ballistics/dist/v2';
import { useProfile } from '../../context/profileContext';
import { Text } from 'react-native-paper';


function findOppositeCathetus(hypotenuse, angleInDegrees) {
    // Переводимо кут у градусах у радіани
    const angleInRadians = angleInDegrees * (Math.PI / 180);
    // Обчислюємо протилежний катет
    const oppositeCathetus = hypotenuse * Math.sin(angleInRadians);
    return oppositeCathetus;
}

// Arrow function component
const WindageChart = () => {

    const { hitResult } = useProfile()

    if (!hitResult) return (
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
        <LineChart
            data={data}
            width={720}
            height={240}
            chartConfig={chartConfig}
            fromZero={true}
        />
    );
};


const chartConfig = {
    // backgroundGradientFrom: "#1E2923",
    // backgroundGradientFromOpacity: 0,
    // backgroundGradientTo: "#08130D",
    // backgroundGradientToOpacity: 0.5,

    backgroundGradientFrom: "#000000",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#000000",
    backgroundGradientToOpacity: 0,

    // backgroundColor: "#FFFFFF",

    color: (opacity = 0.5) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: true, // optional

    style: {
        borderRadius: 16
    },
};


export default WindageChart;