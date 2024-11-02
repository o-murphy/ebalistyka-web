import { DataTable, Text } from 'react-native-paper';
import { HitResult, TrajectoryData, UNew, UnitProps } from 'js-ballistics/dist/v2';
import { StyleSheet, ScrollView, View } from 'react-native';
import { useTheme } from '../../../../context/themeContext';
import { useState } from 'react';
import { usePreferredUnits } from '../../../../context/preferredUnitsContext';
import { useCalculator } from '../../../../context/profileContext';
import { Unit } from 'js-ballistics';


export const TrajectoryTable = ({ hitResult, reverse = false }: { hitResult: HitResult | Error, reverse?: boolean }) => {
  const tableWidth = styles.tableScrollable.width;

  const [containerWidth, setContainerWidth] = useState(tableWidth); // State for container width

  const { preferredUnits } = usePreferredUnits()
  const { currentConditions } = useCalculator()



  const isScrollable = containerWidth < tableWidth;


  const { theme } = useTheme()
  const hitResultError = hitResult instanceof Error;

  // const trajectory = !hitResultError && hitResult?.trajectory.filter(row => 
  //   row => Math.round(row.distance.rawValue * 100) / 100 % trajectoryStepRaw === 0

  // )

  let trajectory = [];

  if (!hitResultError) {
    
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

  console.log("Filtered", trajectory.length)

  const headerStyle = {
    textStyle: tableStyles.cellText,
    style: theme?.dark ? tableStyles.cellDark : tableStyles.cellLight,
  }

  const holdRow = trajectory.slice(1).reduce((closest, item) => Math.abs(item.dropAdjustment.rawValue) < Math.abs(closest.dropAdjustment.rawValue) ? item : closest, trajectory[1]);

  // reverse && trajectory.sort((a, b) => b.time - a.time)


  const dataRowStyle = (row: TrajectoryData): Object => {
    // const rawAdj = parseFloat(row.dropAdjustment.rawValue.toFixed(4))
    // return {
    //   textStyle: rawAdj === 0 ? tableStyles.cellZeroText : tableStyles.cellText,
    //   style: theme?.dark ? tableStyles.cellDark : tableStyles.cellLight,
    // }
    
    return {
      textStyle: row === holdRow ? tableStyles.cellZeroText : tableStyles.cellText,
      style: theme?.dark ? tableStyles.cellDark : tableStyles.cellLight,
    }
  }

  const HeaderText = ({ children }: { children: React.ReactNode }) => {
    return (
      <DataTable.Title {...headerStyle}>
        <Text style={{ ...tableStyles.cellText }}>
          {children}
        </Text>
      </DataTable.Title>
    )
  }

  const headerTitles = ["Time", "Range", "V", "Height",
    "Drop", "Drop adjustment",
    "Windage", "Wind. adjustment",
    // "Look distance",
    // "Angle",
    "Mach", "Density", "Drag", "Energy"
  ]

  const headerUnits = [
    "s",
    preferredUnits.distance,
    preferredUnits.velocity,
    preferredUnits.drop,
    preferredUnits.drop,
    preferredUnits.adjustment,
    preferredUnits.drop,
    preferredUnits.adjustment,
    // preferredUnits.distance, // look
    // preferredUnits.angular, // angle
    "",
    "",
    "",
    preferredUnits.energy,
  ]

  return (
    <View onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}>

      <ScrollView horizontal={isScrollable}>

        <View style={isScrollable ? styles.tableScrollable : styles.tableFullWidth}>

          <DataTable>
            <DataTable.Header style={tableStyles.row}>
              {headerTitles.map((item, index) => <HeaderText key={`${index}`}>{item}</HeaderText>)}
            </DataTable.Header>

            <DataTable.Header style={tableStyles.row}>
              {headerUnits.map((item, index) => <HeaderText key={`${index}`}>{UnitProps[item] ? UnitProps[item].symbol : item}</HeaderText>)}
            </DataTable.Header>

            {!hitResultError && trajectory.map((row, index) => (
              <DataTable.Row key={`${index}`} style={tableStyles.row}>
                <DataTable.Cell {...dataRowStyle(row)}>{row.time.toFixed(3)}</DataTable.Cell>
                <DataTable.Cell {...dataRowStyle(row)}>{(row.distance).In(preferredUnits.distance).toFixed(0)}</DataTable.Cell>
                <DataTable.Cell {...dataRowStyle(row)}>{row.velocity.In(preferredUnits.velocity).toFixed(0)}</DataTable.Cell>
                <DataTable.Cell {...dataRowStyle(row)}>{row.height.In(preferredUnits.drop).toFixed(1)}</DataTable.Cell>
                <DataTable.Cell {...dataRowStyle(row)}>{row.targetDrop.In(preferredUnits.drop).toFixed(1)}</DataTable.Cell>
                <DataTable.Cell {...dataRowStyle(row)}>{row.dropAdjustment.In(preferredUnits.adjustment).toFixed(2)}</DataTable.Cell>
                <DataTable.Cell {...dataRowStyle(row)}>{row.windage.In(preferredUnits.drop).toFixed(1)}</DataTable.Cell>
                <DataTable.Cell {...dataRowStyle(row)}>{row.windageAdjustment.In(preferredUnits.adjustment).toFixed(2)}</DataTable.Cell>
                <DataTable.Cell {...dataRowStyle(row)}>{row.mach.toFixed(2)}</DataTable.Cell>
                <DataTable.Cell {...dataRowStyle(row)}>{row.densityFactor.toFixed(2)}</DataTable.Cell>
                <DataTable.Cell {...dataRowStyle(row)}>{row.drag.toFixed(3)}</DataTable.Cell>
                <DataTable.Cell {...dataRowStyle(row)}>{row.energy.In(preferredUnits.energy).toFixed(0)}</DataTable.Cell>
              </DataTable.Row>
            ))}

          </DataTable>
        </View>
      </ScrollView>
    </View>
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
