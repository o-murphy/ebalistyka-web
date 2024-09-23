import { LineChart } from 'react-native-chart-kit';

import {
    preferredUnits, Unit, Atmo, Shot, UNew
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
const TrajectoryChart = () => {

    const {hitResult} = useProfile()

    if (!hitResult) return (
        <Text>Can't display chart</Text>
    );
    console.log("res", hitResult.trajectory)
    const result = hitResult.trajectory;
    const data = {
        labels: result.map((row) => row.distance.In(preferredUnits.distance).toFixed(0)),
        datasets: [
            {
                data: result.map((row) => row.height.In(preferredUnits.drop)),
            },
            {
                data: result.map((row) => row.velocity.In(preferredUnits.velocity)),
                color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
            },
            {
                data: result.map(row => findOppositeCathetus(
                    row.lookDistance.In(preferredUnits.distance),
                    result[0].angle.In(Unit.Degree)
                )),
                color: (opacity = 1) => `rgba(134, 0, 0, ${opacity})`,
            },
        ],
        legend: ["Trajectory", "Velocity", "Barrel line"],
    };

    return (
        <LineChart
            data={data}
            width={640}
            height={480}
            chartConfig={chartConfig}
        />
    );
};


const chartConfig = {
    // backgroundGradientFrom: "#1E2923",
    // backgroundGradientFromOpacity: 0,
    // backgroundGradientTo: "#08130D",
    // backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
};


export default TrajectoryChart;