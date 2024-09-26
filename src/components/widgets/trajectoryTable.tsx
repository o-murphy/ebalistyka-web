import { DataTable, Text } from 'react-native-paper';
import {
    preferredUnits, TrajectoryData, UnitProps
} from 'js-ballistics/dist/v2';
import { useProfile } from '../../context/profileContext';
import { StyleSheet, ScrollView, View } from 'react-native';
import { useTheme } from '../../context/themeContext';
import CustomCard from '../cards/customCard';
import { useState } from 'react';


// Arrow function component
const TrajectoryTable = () => {
    const [containerWidth, setContainerWidth] = useState(0); // State for container width

    const tableWidth = 800;
    const isScrollable = containerWidth < tableWidth;


    const { hitResult } = useProfile()
    const { theme } = useTheme()
    const hitResultError = hitResult instanceof Error;

    const headerStyle = {
        textStyle: tableStyles.cellText,
        style: theme?.dark ? tableStyles.cellDark : tableStyles.cellLight,
    }

    const dataRowStyle = (row: TrajectoryData): Object => {
        const rawAdj = parseFloat(row.dropAdjustment.rawValue.toFixed(4))
        return {
            textStyle: rawAdj === 0 ? tableStyles.cellZeroText : tableStyles.cellText,
            style: theme?.dark ? tableStyles.cellDark : tableStyles.cellLight,
        }
    }

    const HeaderText = ({ children }: { children: React.ReactNode }) => {
        return (
            <DataTable.Title {...headerStyle}>
                <Text style={{...tableStyles.cellText}}>
                    {children}
                </Text>
            </DataTable.Title>
        )
    }

    return (
        <CustomCard title='Trajectory'>
          <View onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}>
            <ScrollView horizontal={isScrollable}>
              <View style={isScrollable ? styles.tableScrollable : styles.tableFullWidth}>
                <DataTable>
                  <DataTable.Header style={tableStyles.row}>
                    <HeaderText>Time, s</HeaderText>
                    <HeaderText>Range, {UnitProps[preferredUnits.distance].symbol}</HeaderText>
                    <HeaderText>V, {UnitProps[preferredUnits.velocity].symbol}</HeaderText>
                    <HeaderText>Mach</HeaderText>
                    <HeaderText>Height, {UnitProps[preferredUnits.drop].symbol}</HeaderText>
                    <HeaderText>Drop, {UnitProps[preferredUnits.drop].symbol}</HeaderText>
                    <HeaderText>Drop adj., {UnitProps[preferredUnits.adjustment].symbol}</HeaderText>
                    <HeaderText>Windage, {UnitProps[preferredUnits.drop].symbol}</HeaderText>
                    <HeaderText>Wind. adj., {UnitProps[preferredUnits.adjustment].symbol}</HeaderText>
                    <HeaderText>Look dst., {UnitProps[preferredUnits.distance].symbol}</HeaderText>
                    <HeaderText>Angle, {UnitProps[preferredUnits.angular].symbol}</HeaderText>
                    <HeaderText>Density</HeaderText>
                    <HeaderText>Drag</HeaderText>
                    <HeaderText>Energy, {UnitProps[preferredUnits.energy].symbol}</HeaderText>
                    {/* <HeaderText>OGW, {UnitProps[preferredUnits.ogw].symbol}</HeaderText> */}
                  </DataTable.Header>
    
                  {!hitResultError && hitResult?.trajectory.map((row, index) => (
                    <DataTable.Row key={index} style={tableStyles.row}>
                      <DataTable.Cell {...dataRowStyle(row)}>{row.time.toFixed(3)}</DataTable.Cell>
                      <DataTable.Cell {...dataRowStyle(row)}>{(row.distance).In(preferredUnits.distance).toFixed(0)}</DataTable.Cell>
                      <DataTable.Cell {...dataRowStyle(row)}>{row.velocity.In(preferredUnits.velocity).toFixed(0)}</DataTable.Cell>
                      <DataTable.Cell {...dataRowStyle(row)}>{row.mach.toFixed(2)}</DataTable.Cell>
                      <DataTable.Cell {...dataRowStyle(row)}>{row.height.In(preferredUnits.drop).toFixed(1)}</DataTable.Cell>
                      <DataTable.Cell {...dataRowStyle(row)}>{row.targetDrop.In(preferredUnits.drop).toFixed(1)}</DataTable.Cell>
                      <DataTable.Cell {...dataRowStyle(row)}>{row.dropAdjustment.In(preferredUnits.adjustment).toFixed(2)}</DataTable.Cell>
                      <DataTable.Cell {...dataRowStyle(row)}>{row.windage.In(preferredUnits.drop).toFixed(1)}</DataTable.Cell>
                      <DataTable.Cell {...dataRowStyle(row)}>{row.windageAdjustment.In(preferredUnits.adjustment).toFixed(2)}</DataTable.Cell>
                      <DataTable.Cell {...dataRowStyle(row)}>{row.lookDistance.In(preferredUnits.distance).toFixed(0)}</DataTable.Cell>
                      <DataTable.Cell {...dataRowStyle(row)}>{row.angle.In(preferredUnits.angular).toFixed(2)}</DataTable.Cell>
                      <DataTable.Cell {...dataRowStyle(row)}>{row.densityFactor.toFixed(2)}</DataTable.Cell>
                      <DataTable.Cell {...dataRowStyle(row)}>{row.drag.toFixed(3)}</DataTable.Cell>
                      <DataTable.Cell {...dataRowStyle(row)}>{row.energy.In(preferredUnits.energy).toFixed(0)}</DataTable.Cell>
                      {/* <DataTable.Cell {...dataRowStyle(row)}>{row.ogw.In(preferredUnits.ogw).toFixed(0)}</DataTable.Cell> */}
                    </DataTable.Row>
                  ))}
    
                </DataTable>
              </View>
            </ScrollView>
          </View>
        </CustomCard>
      );
};

const styles = StyleSheet.create({
    tableFullWidth: {
      width: '100%', // Take full container width
    },
    tableScrollable: {
      width: 800, // Fixed width for scrollable table
    },
});

const tableStyles = StyleSheet.create({
    cellText: {
        fontSize: 14,
    },
    cellZeroText: {
        fontSize: 14,
        color: "red",
    },
    row: {
        paddingVertical: 0,
        minHeight: 20,
        paddingHorizontal: 0
    },
    cellDark: {
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: "#49454f", // rgb(73, 69, 79) #49454f / rgb(231, 224, 236) #e7e0ec
        justifyContent: "center",
    },
    cellLight: {
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: "#e7e0ec", // rgb(73, 69, 79) #49454f / rgb(231, 224, 236) #e7e0ec
        justifyContent: "center",
    },
    headerTextContainer: {
        transform: [{ rotate: '-90deg' }],
    },
})

export default TrajectoryTable;