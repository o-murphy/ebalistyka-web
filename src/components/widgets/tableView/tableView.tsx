import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Table, Row } from 'react-native-table-component';
import { useCalculator } from '../../../context/profileContext';
import { HitResult, TrajectoryData, TrajFlag, UNew, UnitProps } from 'js-ballistics/dist/v2';
import { usePreferredUnits } from '../../../context/preferredUnitsContext';
import { RowDetailsDialog } from './rowDetaisDialog';
import { useTableSettings } from '../../../context/tableSettingsContext';


interface TableDataType {
    data: string[];
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}


interface ResponsiveTableViewProps {
    tableHeaders: string[];
    tableData: TableDataType[];
    style?: StyleProp<ViewStyle>;
}


const useTableHeaders = () => {

    const { preferredUnits } = usePreferredUnits()

    return [
        `Time, s`,
        `Range, ${UnitProps[preferredUnits.distance].symbol}`,
        `V, ${UnitProps[preferredUnits.velocity].symbol}`,
        `Height, ${UnitProps[preferredUnits.drop].symbol}`,
        `Drop, ${UnitProps[preferredUnits.drop].symbol}`,
        `Drop adjustment, ${UnitProps[preferredUnits.adjustment].symbol}`,
        `Windage, ${UnitProps[preferredUnits.drop].symbol}`,
        `Wind. adjustment, ${UnitProps[preferredUnits.adjustment].symbol}`,
        "Mach",
        "Drag",
        `Energy, ${UnitProps[preferredUnits.energy].symbol}`
    ];
}


const useMappedTableData = (row: TrajectoryData) => {

    const { preferredUnits } = usePreferredUnits()

    return [
        row.time.toFixed(3),
        (row.distance).In(preferredUnits.distance).toFixed(0),
        row.velocity.In(preferredUnits.velocity).toFixed(0),
        row.height.In(preferredUnits.drop).toFixed(1),
        row.targetDrop.In(preferredUnits.drop).toFixed(1),
        row.dropAdjustment.In(preferredUnits.adjustment).toFixed(2),
        row.windage.In(preferredUnits.drop).toFixed(1),
        row.windageAdjustment.In(preferredUnits.adjustment).toFixed(2),
        row.mach.toFixed(2),
        row.drag.toFixed(3),
        row.energy.In(preferredUnits.energy).toFixed(0),
    ]
}


export const ResponsiveTableView: React.FC<ResponsiveTableViewProps> = ({ tableHeaders, tableData, style = null }) => {

    const theme = useTheme()
    const [selection, setSelection] = useState(null)
    const [longPressed, setLongPressed] = useState(null)
    const [detailsVisible, setDetailsVisible] = useState(false)

    const select = (index) => {
        setSelection(index)
    }

    const handleLongPress = (event, index) => {
        setLongPressed(index)
        setDetailsVisible(true)
    }

    const styles = StyleSheet.create({
        noSelect: {
            userSelect: 'none', // This will prevent text selection on web
        },
        horizontalScroll: {
            flexGrow: 1,
        },
        tableContainer: { minWidth: "100%" },  // Ensures the table takes up available space
        table: {},
        header: {
            height: 64,
        },
        headerText: { textAlign: 'center', fontWeight: 'bold', color: theme.colors.onSurfaceVariant },

        selectedRow: { backgroundColor: theme.colors.primaryContainer },
        selectedRowText: { textAlign: 'center', color: theme.colors.onPrimaryContainer },

        dataWrapper: { flex: 1, },  // Adjust as needed for vertical scrollable area

        borderStyle: { borderWidth: 2, borderColor: theme.colors.surfaceVariant }
    });

    return (
        <View style={[style, styles.noSelect]}>
            <RowDetailsDialog row={tableData?.[longPressed]?.data} visible={detailsVisible} setVisible={setDetailsVisible} />

            <ScrollView horizontal contentContainerStyle={styles.horizontalScroll}>
                <View style={styles.tableContainer}>
                    <Table borderStyle={styles.borderStyle} style={styles.table}>
                        <Row data={tableHeaders} style={styles.header} textStyle={styles.headerText} />
                    </Table>

                    <ScrollView style={styles.dataWrapper}>
                        <Table borderStyle={styles.borderStyle} style={styles.table}>
                            {tableData.map((rowData, index) => (
                                <Pressable
                                    key={index}
                                    onPress={() => select(index)} // Regular press
                                    onLongPress={(event) => { handleLongPress(event, index) }} // Long press
                                    delayLongPress={300} // Optional: delay before the long press is recognized
                                >
                                    <Row
                                        data={rowData.data}
                                        style={index === selection ? styles.selectedRow : rowData?.style}
                                        textStyle={index === selection ? styles.selectedRowText : rowData?.textStyle}
                                        borderStyle={styles.borderStyle}
                                    />
                                </Pressable>
                            ))}
                        </Table>
                    </ScrollView>
                </View>
            </ScrollView>
        </View>
    );
};


export const ZerosDataTable = ({ hitResult, style = null }) => {
    if (!(hitResult instanceof HitResult)) return <></>

    const theme = useTheme()

    const tableHeaders = [
        // "", 
        ...useTableHeaders()
    ]

    const zeros = hitResult.trajectory.filter(row => row.flag & TrajFlag.ZERO);

    const styles = StyleSheet.create({
        text: { textAlign: 'center', color: theme.colors.onSurfaceVariant },
        zeroText: { textAlign: 'center', color: theme.colors.onErrorContainer },
        zeroRow: { backgroundColor: theme.colors.errorContainer },
        selectedRow: { backgroundColor: "blue" },
    });

    const tableData: TableDataType[] = zeros.map(row => {
        return {
            textStyle: styles.text,
            data: [
                // row.flag & TrajFlag.ZERO_UP ? "Up" : "Down",
                ...useMappedTableData(row)
            ]
        }
    });

    return <ResponsiveTableView tableHeaders={tableHeaders} tableData={tableData} style={style} />
}


export const TrajectoryTable = ({ hitResult, style = null }) => {
    if (!(hitResult instanceof HitResult)) return <></>

    const theme = useTheme()
    const { tableSettings } = useTableSettings()

    console.log("TS", tableSettings)

    const tableHeaders = useTableHeaders()

    const trajectoryStepRaw = UNew.Meter(tableSettings.trajectoryStep).rawValue
    const trajectoryRangeRaw = UNew.Meter(tableSettings.trajectoryRange + 1).rawValue

    let trajectory = [];

    for (let i = 0; i <= trajectoryRangeRaw; i += trajectoryStepRaw) {
        const closestValue = hitResult?.trajectory.reduce((closest, item) => {
            const itemDifference = Math.abs(item.distance.rawValue - i);
            const closestDifference = Math.abs(closest.distance.rawValue - i);
            return itemDifference < closestDifference ? item : closest;
        }, hitResult.trajectory[0]); // Start with the first element as the initial closest

        if (closestValue) {
            trajectory.push(closestValue);
        }
    }

    trajectory = trajectory.filter(row => row.distance.rawValue <= trajectoryRangeRaw)

    const zeroRow = trajectory.slice(1).reduce((closest, item) => {
        const itemDifference = Math.abs(item.dropAdjustment.rawValue - 0);
        const closestDifference = Math.abs(closest.dropAdjustment.rawValue - 0);
        return itemDifference < closestDifference ? item : closest;
    }, trajectory[1]); // Start with the first element as the initial closest

    const styles = StyleSheet.create({
        text: { textAlign: 'center', color: theme.colors.onSurfaceVariant },
        zeroText: { textAlign: 'center', color: theme.colors.onErrorContainer },
        zeroRow: { backgroundColor: theme.colors.errorContainer },
        selectedRow: { backgroundColor: "blue" },
    });

    const tableData: TableDataType[] = trajectory.map((row, index) => {
        return {
            textStyle: zeroRow === row ? styles.zeroText : styles.text,
            style: zeroRow === row && styles.zeroRow,
            data: useMappedTableData(row)
        }
    });

    return (
        <ResponsiveTableView
            tableHeaders={tableHeaders}
            tableData={tableData}
            style={style}
        />
    )
}