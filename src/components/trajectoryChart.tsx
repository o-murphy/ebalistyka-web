import { LineChart } from 'react-native-chart-kit';

import {
    preferredUnits, Unit, Atmo, Shot, UNew
} from 'js-ballistics/dist/v2';


// Arrow function component
const TrajectoryChart = ({ calculatorData }) => {
    if (!calculatorData) {
        return null;
    }

    const { calc } = calculatorData;
    const atmo = Atmo.icao({});
    const lookAngle = UNew.MIL(5);
    const targetShot = new Shot({
        weapon: calculatorData.weapon,
        ammo: calculatorData.ammo,
        atmo: atmo,
        lookAngle: lookAngle,
    });

    const hit = calc.fire({
        shot: targetShot,
        trajectoryRange: UNew.Meter(1001),
        trajectoryStep: UNew.Meter(100),
    });

    const result = hit.trajectory.map((row) => row);
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
                data: result.map((row) => row.distance.In(preferredUnits.distance) * Math.cos(lookAngle.In(Unit.Degree))),
                color: (opacity = 1) => `rgba(134, 0, 0, ${opacity})`,
            },
        ],
        legend: ["Trajectory", "Velocity"],
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