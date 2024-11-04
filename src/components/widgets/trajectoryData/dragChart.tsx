import { Card, useTheme } from 'react-native-paper';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useCalculator } from '../../../context/profileContext';
import { Table } from 'js-ballistics/dist/v2';
import React from 'react';
import { ToolTipRow } from './abstract';

interface DragTooltipProps {
    active?: boolean;
    label?: number; // Expecting label as a number for Mach
    payload?: any; // Each payload should have a number value
}

const DragTooltip: React.FC<DragTooltipProps> = ({ active, label, payload }) => {
    const theme = useTheme();

    if (active && payload && payload.length) {
        const machValue = `${label?.toFixed(2)}`; // Ensure label is defined
        const standardCdValue = payload[0]?.value !== undefined ? `${payload[0].value.toFixed(4)}` : null;
        const customCdValue = payload[1]?.value !== undefined ? `${payload[1].value.toFixed(4)}` : null;

        return (
            <Card elevation={2} style={{ backgroundColor: `rgba(${theme.colors.primaryContainer}, 0.5)` }}>
                <Card.Content>
                    <ToolTipRow label={`Mach:`} value={machValue} />
                    {standardCdValue && <ToolTipRow label={`Standard:`} value={standardCdValue} />}
                    {customCdValue && <ToolTipRow label={`Custom:`} value={customCdValue} />}
                </Card.Content>
            </Card>
        );
    }

    return null;
};

const combineDragTables = (dragTable, customDragTable) => {
    const dragMap = new Map();

    // Populate the map with standard drag values
    dragTable?.forEach(row => {
        dragMap.set(row.Mach, { Mach: row.Mach, CDStandard: row.CD, CDCustom: null });
    });

    // Add custom drag values
    customDragTable?.forEach(row => {
        if (dragMap.has(row.Mach)) {
            dragMap.get(row.Mach).CDCustom = row.CD;
        } else {
            dragMap.set(row.Mach, { Mach: row.Mach, CDStandard: null, CDCustom: row.CD });
        }
    });

    return Array.from(dragMap.values());
};

const DragChart = () => {
    const { calculator, profileProperties } = useCalculator();
    const theme = useTheme();

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

    const customDragTable = calculator?.calc?.cdm ?? null;

    // Generate the combined dataset
    const data = combineDragTables(dragTable, customDragTable);

    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart
                data={data}
                margin={{ top: 50, right: 90, left: 30, bottom: 35 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    type="number"
                    dataKey="Mach"
                    domain={['dataMin', 'dataMax']}
                    tickCount={10}
                    label={{ value: 'Mach Number', position: 'insideBottom', offset: -10 }}
                    angle={0}
                    textAnchor="middle"
                />
                <YAxis
                    label={{ value: 'Drag Coefficient', angle: -90, position: 'insideBottomLeft' }}
                />
                <Tooltip content={(props) => <DragTooltip {...props} />} />
                <Legend verticalAlign="top" layout="horizontal" wrapperStyle={{ paddingBottom: 10 }} />

                {/* Line for Standard Drag Table */}
                {dragTable && (
                    <Line
                        type="monotone"
                        dataKey="CDStandard"
                        stroke={theme.colors.primary}
                        strokeWidth={1}
                        dot={false}
                        name={`Standard ${profileProperties?.bcType}`}
                    />
                )}
                {/* Line for Custom Drag Table */}
                {customDragTable && (
                    <Line
                        type="monotone"
                        dataKey="CDCustom"
                        stroke={"orange"}
                        strokeWidth={2}
                        dot={false}
                        name="Custom"
                    />
                )}
            </LineChart>
        </ResponsiveContainer>
    );
};

export default DragChart;
