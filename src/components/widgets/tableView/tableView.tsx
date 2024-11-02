import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Table, Row, Rows } from 'react-native-table-component';
import { useCalculator } from '../../../context/profileContext';
import { HitResult, UNew, UnitProps } from 'js-ballistics/dist/v2';
import { usePreferredUnits } from '../../../context/preferredUnitsContext';


const ResponsiveTableView = () => {

  const theme = useTheme()
  const {hitResult, currentConditions} = useCalculator()
  const {preferredUnits} = usePreferredUnits()

  if (!(hitResult instanceof HitResult)) {
    return(
        <></>
    )
  }

  console.log(theme.colors)

  const tableHead = [
    `Time, s`, 
    `Range, ${UnitProps[preferredUnits.distance].symbol}`, 
    `V, ${UnitProps[preferredUnits.velocity].symbol}`, 
    `Height, ${UnitProps[preferredUnits.drop].symbol}`,
    `Drop, ${UnitProps[preferredUnits.drop].symbol}`, 
    `Drop adjustment, ${UnitProps[preferredUnits.adjustment].symbol}`,
    `Windage, ${UnitProps[preferredUnits.drop].symbol}`, 
    `Wind. adjustment, ${UnitProps[preferredUnits.adjustment].symbol}`,
    "Mach", 
    // "Density", 
    "Drag", 
    `Energy, ${UnitProps[preferredUnits.energy].symbol}`
  ];

  let trajectory = [];

  if (hitResult instanceof HitResult) {
    
    const trajectoryStepRaw = UNew.Meter(currentConditions.trajectoryStep).rawValue
    // const trajectoryRangeRaw = UNew.Meter(currentConditions.trajectoryRange).rawValue
    const trajectoryRangeRaw = hitResult.trajectory[hitResult.trajectory.length - 1].distance.rawValue

    for (let i = 0; i <= trajectoryRangeRaw; i += trajectoryStepRaw) {
      // Find all values in `hitResult.trajectory` that are closest to `i`
      const closestValues = hitResult?.trajectory.filter(item => {
        // Calculate the absolute difference between the current increment `i` and the item's distance
        const distance = item.distance.rawValue; // Adjust as necessary for your actual distance value
        const difference = Math.abs(distance - i);
        
        // Define how "close" is acceptable (for example, within a certain threshold)
        // return difference <= (trajectoryStepRaw / 2); // Adjust the threshold if needed
        return difference <= 1; // Adjust the threshold if needed
      });
    
      // Combine closest values into the trajectory array
      trajectory = trajectory.concat(closestValues);
    }
  
  }

  const holdRow = trajectory.slice(1).reduce((closest, item) => Math.abs(item.dropAdjustment.rawValue) < Math.abs(closest.dropAdjustment.rawValue) ? item : closest, trajectory[1]);
  const holdRowIndex = trajectory.indexOf(holdRow)

  const tableData = trajectory.map(row => {
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
        // row.densityFactor.toFixed(4),
        row.drag.toFixed(3),
        row.energy.In(preferredUnits.energy).toFixed(0),
    ]
  });

  const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 16, 
        // backgroundColor: "#f00" 
    },
    horizontalScroll: { 
        flexGrow: 1, 
        // backgroundColor: '#0f0' 
    },
    tableContainer: { minWidth: "100%" },  // Ensures the table takes up available space
  
    table: { 
        // backgroundColor: '#00f' 
    },  // Ensures the table fills the parent width if the parent is wider
    header: { 
        height: 64, 
        // backgroundColor: '#ddd' 
    },
    headerText: { textAlign: 'center', fontWeight: 'bold', color: theme.colors.secondary },
    
    text: { textAlign: 'center', color: theme.colors.secondary  },
    row: { height: 20, },

    zeroText: {textAlign: 'center', color: theme.colors.onErrorContainer},
    zeroRow: { height: 20, backgroundColor: theme.colors.errorContainer},

    dataWrapper: { flex: 1,},  // Adjust as needed for vertical scrollable area

    borderStyle: {borderWidth: 1, borderColor: theme.colors.secondary}
  });

  return (
    <View style={styles.container}>
      <ScrollView horizontal contentContainerStyle={styles.horizontalScroll}>
        <View style={styles.tableContainer}>
          <Table borderStyle={styles.borderStyle} style={styles.table}>
            <Row data={tableHead} style={styles.header} textStyle={styles.headerText} />
          </Table>
          
          <ScrollView style={styles.dataWrapper}>
            <Table borderStyle={styles.borderStyle} style={styles.table}>
              {/* <Rows data={tableData} textStyle={styles.text} style={styles.rows}/> */}
              {tableData.map((rowData, index) => (
                <Row 
                  key={index} 
                  data={rowData} 
                  textStyle={index === holdRowIndex ? styles.zeroText : styles.text} 
                  style={index === holdRowIndex ? styles.zeroRow : styles.row} // Apply special style to the first row
                />
              ))}
            </Table>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};



export default ResponsiveTableView;
