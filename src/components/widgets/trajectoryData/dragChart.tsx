import { Card } from 'react-native-paper';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useProfile } from '../../../context/profileContext';
import { Table } from 'js-ballistics/dist/v2';
import React from 'react';
import { useTheme } from '../../../context/themeContext';
import { ToolTipRow } from './abstract';

const DragTooltip = ({ active, label, payload }) => {
    const { theme } = useTheme();

    if (active && payload && payload.length) {
        const machValue = `${label.toFixed(2)}`;
        const standardCdValue = payload[0]?.value && `${payload[0].value.toFixed(4)}`;
        const customCdValue = payload[1]?.value && `${payload[1].value.toFixed(4)}`; // Assuming CDCustom is the second payload

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
    const { calculator, profileProperties } = useProfile();
    const { theme } = useTheme();

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

    const customDragTable = calculator?.calc?.cdm ?? null;

    // Generate the combined dataset
    const data = combineDragTables(dragTable, customDragTable);
    console.log(data); // Check data structure

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
                        stroke={theme.colors.onSurface}
                        strokeWidth={1}
                        dot={false}
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
                        isAnimationActive={false}
                    />
                )}
            </LineChart>
        </ResponsiveContainer>
    );
};

export default DragChart;