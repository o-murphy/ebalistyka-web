import { Card, Text, useTheme } from 'react-native-paper';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Angular, Distance, HitResult, UNew, UnitProps } from 'js-ballistics/dist/v2';
import getFractionDigits from '../../../../utils/fractionConvertor';
import React from 'react';
import { ToolTipRow } from './tooltipRow';

interface WindageTooltipProps {
    active?: boolean;
    label?: string;
    payload?: any;
    preferredUnits: any;
}

const WindageTooltip: React.FC<WindageTooltipProps> = ({ active = false, label = '', payload = [], preferredUnits }) => {
    const theme = useTheme()

    const windageAccuracy = getFractionDigits(0.1, UNew.Inch(1).In(preferredUnits.drop));
    const windageAdjAccuracy = getFractionDigits(0.01, UNew.MIL(1).In(preferredUnits.adjustment));
    const distanceAccuracy = getFractionDigits(1, UNew.Meter(1).In(preferredUnits.distance));

    console.log({ active, label, payload }); // Debugging log

    const roundWindage = (windage: number) => {
        return windage.toFixed(windageAccuracy);
    };

    const roundWindageAdj = (windAdj: number) => {
        return windAdj.toFixed(windageAdjAccuracy);
    };

    const roundDistance = (distance: string) => {
        return parseFloat(distance).toFixed(distanceAccuracy);
    };

    if (active && payload.length > 0) {
        const distanceValue = `${roundDistance(label)} ${UnitProps[preferredUnits.distance].symbol}`;
        const windageValue = `${roundWindage(payload[0].value)} ${UnitProps[preferredUnits.drop].symbol}`;
        const windageAdjValue = `${roundWindageAdj(payload[0].payload.windageAdj)} ${UnitProps[preferredUnits.adjustment].symbol}`;

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
    maxDistance: Distance;
}

export const WindageChart: React.FC<WindageChartProps> = ({
    results, preferredUnits, maxDistance
}) => {
    const theme = useTheme()

    if (results instanceof Error) return (
        <Text>Can't display chart</Text>
    );

    const result = results.trajectory.filter(row => row.distance.rawValue <= maxDistance.rawValue);

    const data = result.map(row => ({
        distance: row.distance.In(preferredUnits.distance),
        windage: row.windage.In(preferredUnits.drop),
        windageAdj: row.windageAdjustment.In(preferredUnits.adjustment), // Include adjustment value in data
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
                    type="monotone" // Alternative to "monotone"
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
