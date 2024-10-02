import { Card, Text } from 'react-native-paper';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { StyleSheet } from 'react-native';
import { useProfile } from '../../../context/profileContext';
import { usePreferredUnits } from '../../../context/preferredUnitsContext';
import { Angular, Distance, UNew, UnitProps } from 'js-ballistics/dist/v2';
import getFractionDigits from '../../../utils/fractionConvertor';
import { useTheme } from '../../../context/themeContext';

const CustomTooltip = ({ active, label, payload, preferredUnits }) => {
    const { theme } = useTheme();


    if (active && payload && payload.length) {
        console.log("PAYLOAD", payload);

        // Get windage and its adjustment from the payload
        const windageValue = `${payload[0].value} ${UnitProps[preferredUnits.drop].symbol}`;
        
        // Here, you can access the adjustment value from the original data
        const windageAdjValue = `${payload[0].payload.windageAdj} ${UnitProps[preferredUnits.adjustment].symbol}`;

        return (
            <Card elevation={2} style={{backgroundColor: `rgba(${theme.colors.primaryContainer}, 0.5)`}}>
                <Card.Content>
                    <Text>
                        {`Distance: ${label} ${UnitProps[preferredUnits.distance].symbol}`}
                    </Text>
                    <Text>
                        {`Windage: ${windageValue}`}
                    </Text>
                    <Text>
                        {`Adjustment: ${windageAdjValue}`}
                    </Text>
                </Card.Content>
            </Card>
        );
    }

    return null;
};

const WindageChart = () => {
    const { adjustedResult } = useProfile();
    const { preferredUnits } = usePreferredUnits();

    const { theme } = useTheme();

    if (adjustedResult instanceof Error) return (
        <Text>Can't display chart</Text>
    );

    const windageAccuracy = getFractionDigits(0.1, UNew.Inch(1).In(preferredUnits.drop));
    const windageAdjAccuracy = getFractionDigits(0.01, UNew.MIL(1).In(preferredUnits.adjustment));
    const distanceAccuracy = getFractionDigits(1, UNew.Meter(1).In(preferredUnits.distance));

    const result = adjustedResult.trajectory;

    const roundWindage = (windage: Distance, accuracy: number) => {
        return parseFloat(windage.In(preferredUnits.drop).toFixed(accuracy));
    };

    const roundWindageAdj = (windAdj: Angular, accuracy: number) => {
        return parseFloat(windAdj.In(preferredUnits.adjustment).toFixed(accuracy));
    };

    const roundDistance = (distance: Distance, accuracy: number) => {
        return parseFloat(distance.In(preferredUnits.distance).toFixed(accuracy));
    };

    // Mapping the data to Recharts format
    const data = result.map(row => ({
        distance: roundDistance(row.distance, distanceAccuracy),
        windage: roundWindage(row.windage, windageAccuracy),
        windageAdj: roundWindageAdj(row.windageAdjustment, windageAdjAccuracy), // Include adjustment value in data
    }));

    return (
        <ResponsiveContainer width="100%" height={240}>
            <LineChart
                data={data}
                margin={{ top: 50, right: 30, left: 30, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="distance"
                    label={{ value: 'Distance', position: 'insideBottomRight', offset: 0 }}
                />
                
                {/* Y-Axis for Windage */}
                <YAxis
                    label={{ value: 'Windage', angle: -90, position: 'insideLeft' }}
                />

                <Tooltip content={(props) => <CustomTooltip {...props} preferredUnits={preferredUnits} />} />
                <Legend />

                {/* Line for Windage */}
                <Line
                    type="monotone"
                    dataKey="windage"
                    // stroke="#8884d8"
                    stroke={theme.colors.primary}
                    strokeWidth={2}
                    dot={false}
                />
                {/* No line for windage adjustment */}
            </LineChart>
        </ResponsiveContainer>
    );
};

const styles = StyleSheet.create({
    customChart: {
        // You can add styles if needed
    }
});

export default WindageChart;


// import { useProfile } from '../../../context/profileContext';
// import { Text } from 'react-native-paper';
// import CustomChart from '../adaptiveChart';
// import { StyleSheet } from 'react-native';
// import { usePreferredUnits } from '../../../context/preferredUnitsContext';


// const AdjustedWindageChart = () => {

//     const { adjustedResult } = useProfile()
//     const { preferredUnits } = usePreferredUnits()

//     if (adjustedResult instanceof Error) return (
//         <Text>Can't display chart</Text>
//     );

//     const result = adjustedResult.trajectory;

//     const data = {
//         labels: result.map((row) => row.distance.In(preferredUnits.distance).toFixed(0)),
//         datasets: [
//             {
//                 data: result.map((row) => row.windage.In(preferredUnits.drop)),
//             },
//         ],
//         legend: ["Windage",],
//     };

//     return (
//         <CustomChart containerStyle={styles.customChart} data={data} 
//             chartProps={{
//                 height: 240,
//                 verticalLabelRotation: -90,
//                 xLabelsOffset: 20,
//             }}
//         />
//     )
// };

// const styles = StyleSheet.create({
//     customChart: {
//         // flex: 1, justifyContent: "center"
//     }
// })

// export default AdjustedWindageChart;