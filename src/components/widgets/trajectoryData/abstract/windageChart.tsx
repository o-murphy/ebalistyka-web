import { Card, Text } from 'react-native-paper';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Angular, Distance, HitResult, UNew, UnitProps } from 'js-ballistics/dist/v2';
import getFractionDigits from '../../../../utils/fractionConvertor';
import { useTheme } from '../../../../context/themeContext';
import React from 'react';
import { ToolTipRow } from './tooltipRow';

interface WindageTooltipProps {
    active?: boolean;
    label?: string;
    payload?: any;
    preferredUnits: any;
}

const WindageTooltip: React.FC<WindageTooltipProps> = ({ active = false, label = '', payload = [], preferredUnits }) => {
    const { theme } = useTheme();

    console.log({ active, label, payload }); // Debugging log

    if (active && payload.length > 0) {
        const distanceValue = `${label} ${UnitProps[preferredUnits.distance].symbol}`;
        const windageValue = `${payload[0].value} ${UnitProps[preferredUnits.drop].symbol}`;
        const windageAdjValue = `${payload[0].payload.windageAdj} ${UnitProps[preferredUnits.adjustment].symbol}`;

        return (
            <Card elevation={2} style={{ backgroundColor: `rgba(${theme.colors.primaryContainer}, 0.5)` }}>
                <Card.Content>
                    <ToolTipRow label={`Distance:`} value={distanceValue} />
                    <ToolTipRow label={`Windage:`} value={windageValue} />
                    <ToolTipRow label={`Adjustment:`} value={windageAdjValue} />
                </Card.Content>
            </Card>
        );
    }

    return null;
};

export interface WindageChartProps {
    results: HitResult | Error;
    preferredUnits: any; 
}

export const WindageChart: React.FC<WindageChartProps> = ({
    results, preferredUnits
}) => {
    const { theme } = useTheme();

    if (results instanceof Error) return (
        <Text>Can't display chart</Text>
    );

    const windageAccuracy = getFractionDigits(0.1, UNew.Inch(1).In(preferredUnits.drop));
    const windageAdjAccuracy = getFractionDigits(0.01, UNew.MIL(1).In(preferredUnits.adjustment));
    const distanceAccuracy = getFractionDigits(1, UNew.Meter(1).In(preferredUnits.distance));

    const result = results.trajectory;

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
                margin={{ top: 50, right: 90, left: 30, bottom: 35 }} // Adjust bottom margin
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    type="number"
                    dataKey="distance"
                    domain={['dataMin', 'dataMax']}
                    tickCount={20}
                    interval={'preserveStartEnd'}
                    label={{ value: 'Distance', position: 'insideBottom', offset: -30 }}
                    angle={-90}
                    textAnchor="end"
                />
                
                {/* Y-Axis for Windage */}
                <YAxis
                    label={{ value: 'Windage', angle: -90, position: 'insideBottomLeft' }}
                />

                <Tooltip content={(props) => <WindageTooltip {...props} preferredUnits={preferredUnits} />} />
                <Legend verticalAlign="top" layout="horizontal" wrapperStyle={{ paddingBottom: 10 }} />

                {/* Line for Windage */}
                <Line
                    type="monotone"
                    dataKey="windage"
                    stroke={theme.colors.primary}
                    strokeWidth={2}
                    dot={false}
                    name="Windage"
                />
                {/* No line for windage adjustment */}
            </LineChart>
        </ResponsiveContainer>
    );
};
