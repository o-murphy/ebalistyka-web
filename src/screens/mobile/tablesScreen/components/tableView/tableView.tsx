import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable, StyleProp, TextStyle, ViewStyle, FlatList } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Table, Row } from 'react-native-table-component';
import { HitResult, TrajFlag, UnitProps } from 'js-ballistics';
import RowDetailsDialog from './rowDetaisDialog';
import { usePreferredUnits, useTableSettings } from '../../../../../context';


interface TableDataType {
    data: string[];
    style: StyleProp<ViewStyle>;
    textStyle: StyleProp<TextStyle>;
}


interface ResponsiveTableViewProps {
    tableHeaders: string[];
    tableData: TableDataType[];
    style: StyleProp<ViewStyle>;
    rowLongPress?: (index: number) => void;
}


const useTableHeaders = ({ displayFlag = false }) => {

    const { preferredUnits: pu } = usePreferredUnits()
    const { tableSettings } = useTableSettings()

    return [
        displayFlag && " ",
        tableSettings?.displayTime && `Time, s`,
        tableSettings?.displayRange && `Range, ${UnitProps[pu.distance].symbol}`,
        tableSettings?.displayVelocity && `V, ${UnitProps[pu.velocity].symbol}`,
        tableSettings?.displayHeight && `Height, ${UnitProps[pu.drop].symbol}`,
        tableSettings?.displayDrop && `Drop, ${UnitProps[pu.drop].symbol}`,
        tableSettings?.displayDropAdjustment && `Drop adjustment, ${UnitProps[pu.adjustment].symbol}`,
        tableSettings?.displayWindage && `Windage, ${UnitProps[pu.drop].symbol}`,
        tableSettings?.displayWindageAdjustment && `Wind. adjustment, ${UnitProps[pu.adjustment].symbol}`,
        tableSettings?.displayMach && "Mach",
        tableSettings?.displayDrag && "Drag",
        tableSettings?.displayEnergy && `Energy, ${UnitProps[pu.energy].symbol}`
    ].filter(Boolean);
}


const useMappedTableData = ({ row, displayFlag = false }) => {

    const { preferredUnits: pu } = usePreferredUnits()
    const { tableSettings } = useTableSettings()
    return [
        displayFlag && (row.flag & TrajFlag.ZERO_UP ? "Up" : row.flag & TrajFlag.ZERO_DOWN ? "Down" : ""),
        tableSettings?.displayTime && row.time.toFixed(3),
        tableSettings?.displayRange && (row.distance).In(pu.distance).toFixed(0),
        tableSettings?.displayVelocity && row.velocity.In(pu.velocity).toFixed(0),
        tableSettings?.displayHeight && row.height.In(pu.drop).toFixed(1),
        tableSettings?.displayDrop && row.targetDrop.In(pu.drop).toFixed(1),
        tableSettings?.displayDropAdjustment && row.dropAdjustment.In(pu.adjustment).toFixed(2),
        tableSettings?.displayWindage && row.windage.In(pu.drop).toFixed(1),
        tableSettings?.displayWindageAdjustment && row.windageAdjustment.In(pu.adjustment).toFixed(2),
        tableSettings?.displayMach && row.mach.toFixed(2),
        tableSettings?.displayDrag && row.drag.toFixed(3),
        tableSettings?.displayEnergy && row.energy.In(pu.energy).toFixed(0),
    ].filter(Boolean)
}


// export const ResponsiveTableView: React.FC<ResponsiveTableViewProps> = ({ tableHeaders, tableData, style = null, rowLongPress = null }) => {

//     const theme = useTheme()
//     const [selection, setSelection] = useState(null)

//     const select = (index) => {
//         setSelection(index)
//     }

//     const onLongPress = (index) => {
//         setSelection(index)
//         rowLongPress?.(index)
//     }

//     const styles = StyleSheet.create({
//         noSelect: {
//             userSelect: 'none'
//         },
//         horizontalScroll: {
//             flexGrow: 1,
//         },
//         tableContainer: { minWidth: "100%" },  // Ensures the table takes up available space
//         table: {},
//         header: {
//             height: 64,
//         },
//         headerText: { textAlign: 'center', fontWeight: 'bold', color: theme.colors.onSurfaceVariant },

//         selectedRow: { backgroundColor: theme.colors.secondaryContainer },
//         selectedRowText: { textAlign: 'center', color: theme.colors.onSecondaryContainer },

//         dataWrapper: { flex: 1, },  // Adjust as needed for vertical scrollable area

//         borderStyle: { borderWidth: 2, borderColor: theme.colors.surfaceVariant }
//     });

//     return (
//         <View style={[style, styles.noSelect]}>

//             <ScrollView horizontal contentContainerStyle={styles.horizontalScroll} overScrollMode="never" bounces={false} alwaysBounceHorizontal={false} alwaysBounceVertical={false}>
//                 <View style={styles.tableContainer}>
//                     <Table borderStyle={styles.borderStyle} style={styles.table}>
//                         <Row data={tableHeaders} style={styles.header} textStyle={styles.headerText} />
//                     </Table>

//                     <ScrollView style={styles.dataWrapper} overScrollMode="never" bounces={false} alwaysBounceVertical={false}>
//                         <Table borderStyle={styles.borderStyle} style={styles.table}>
//                             {tableData.map((rowData, index) => (
//                                 <Pressable
//                                     key={index}
//                                     onPress={() => select(index)} // Regular press
//                                     onLongPress={(event) => onLongPress(index)} // Long press
//                                     delayLongPress={300} // Optional: delay before the long press is recognized
//                                 >
//                                     <Row
//                                         data={rowData.data}
//                                         style={index === selection ? styles.selectedRow : (rowData.style || {})}
//                                         textStyle={index === selection ? styles.selectedRowText : (rowData.textStyle || {})}
//                                         borderStyle={styles.borderStyle}
//                                     />
//                                 </Pressable>
//                             ))}
//                         </Table>
//                     </ScrollView>
//                 </View>
//             </ScrollView>
//         </View>
//     );
// };

export const ResponsiveTableView: React.FC<ResponsiveTableViewProps> = ({ 
    tableHeaders, 
    tableData, 
    style = null, 
    rowLongPress = null 
}) => {
    const theme = useTheme();
    const [selection, setSelection] = useState<number | null>(null);

    const select = (index: number) => {
        setSelection(index);
    };

    const onLongPress = (index: number) => {
        setSelection(index);
        rowLongPress?.(index);
    };

    const styles = StyleSheet.create({
        noSelect: {
            userSelect: 'none',
        },
        horizontalScroll: {
            flexGrow: 1,
        },
        tableContainer: {
            minWidth: '100%', // Ensures the table takes up available space
        },
        table: {},
        header: {
            height: 64,
        },
        headerText: {
            textAlign: 'center',
            fontWeight: 'bold',
            color: theme.colors.onSurfaceVariant,
        },
        selectedRow: {
            backgroundColor: theme.colors.secondaryContainer,
        },
        selectedRowText: {
            textAlign: 'center',
            color: theme.colors.onSecondaryContainer,
        },
        borderStyle: {
            borderWidth: 2,
            borderColor: theme.colors.surfaceVariant,
        },
    });

    return (
        <View style={[style, styles.noSelect]}>
            <ScrollView
                horizontal
                contentContainerStyle={styles.horizontalScroll}
                overScrollMode="never"
                bounces={false}
                alwaysBounceHorizontal={false}
                alwaysBounceVertical={false}
            >
                <View style={styles.tableContainer}>
                    {/* Table Header */}
                    <Table borderStyle={styles.borderStyle} style={styles.table}>
                        <Row 
                            data={tableHeaders} 
                            style={styles.header} 
                            textStyle={styles.headerText} 
                        />
                    </Table>

                    {/* Table Rows with Lazy Loading */}
                    <FlatList
                        data={tableData}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <Pressable
                                onPress={() => select(index)} // Regular press
                                onLongPress={() => onLongPress(index)} // Long press
                                delayLongPress={300} // Optional: delay before the long press is recognized
                            >
                                <Row
                                    data={item.data}
                                    style={index === selection ? styles.selectedRow : (item.style || {})}
                                    textStyle={index === selection ? styles.selectedRowText : (item.textStyle || {})}
                                    borderStyle={styles.borderStyle}
                                />
                            </Pressable>
                        )}
                        initialNumToRender={20} // Number of rows to render initially
                        maxToRenderPerBatch={20} // Number of rows to render per batch
                        windowSize={5} // Viewport size for rendering rows
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

export const ZerosDataTable = ({ hitResult, style = null }) => {
    if (!(hitResult instanceof HitResult)) return <></>

    const theme = useTheme()

    const [longPressed, setLongPressed] = useState(null)
    const [detailsVisible, setDetailsVisible] = useState(false)

    const handleLongPress = (index) => {
        setLongPressed(index)
        setDetailsVisible(true)
    }

    const tableHeaders = useTableHeaders({ displayFlag: true })

    const zeros = hitResult.trajectory.filter(row => row.flag & TrajFlag.ZERO);

    const styles = StyleSheet.create({
        text: { textAlign: 'center', color: theme.colors.onSurfaceVariant },
    });

    const tableData: TableDataType[] = zeros.map(row => {
        return {
            style: null,
            textStyle: styles.text,
            data: useMappedTableData({ row: row, displayFlag: true })
        }
    });

    return (
        <View>
            <RowDetailsDialog row={zeros?.[longPressed]} visible={detailsVisible} setVisible={setDetailsVisible} />
            <ResponsiveTableView tableHeaders={tableHeaders} tableData={tableData} style={style} rowLongPress={handleLongPress} />
        </View>
    )

}


export const TrajectoryTable = ({ hitResult, style = null }) => {
    if (!(hitResult instanceof HitResult)) return <></>

    const theme = useTheme()
    const { trajectoryStep, trajectoryRange } = useTableSettings()

    const [longPressed, setLongPressed] = useState(null)
    const [detailsVisible, setDetailsVisible] = useState(false)

    const handleLongPress = (index) => {
        setLongPressed(index)
        setDetailsVisible(true)
    }

    const tableHeaders = useTableHeaders({ displayFlag: false })

    const trajectoryStepRaw = trajectoryStep.value.rawValue
    const trajectoryRangeRaw = trajectoryRange.value.rawValue + 1

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
        zeroRow: { backgroundColor: theme.colors.tertiaryContainer },
        zeroText: { textAlign: 'center', color: theme.colors.onTertiaryContainer },
    });

    const tableData: TableDataType[] = trajectory.map((row, index) => {
        return {
            textStyle: zeroRow === row ? styles.zeroText : styles.text,
            style: zeroRow === row && styles.zeroRow,
            data: useMappedTableData({ row: row, displayFlag: false })
        }
    });

    return (
        <View style={{ flex: 1 }}>
            <RowDetailsDialog row={trajectory?.[longPressed]} visible={detailsVisible} setVisible={setDetailsVisible} />
            <ResponsiveTableView
                tableHeaders={tableHeaders}
                tableData={tableData}
                style={style}
                rowLongPress={handleLongPress}
            />
        </View>
    )
}