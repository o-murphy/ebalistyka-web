import { DataTable, Text, useTheme } from 'react-native-paper';
import { HitResult, TrajectoryData, Unit, UnitProps } from 'js-ballistics';
import { StyleSheet } from 'react-native';
import { useState } from 'react';


export const TargetShotTable = ({ hitResult, reverse = false }: { hitResult: HitResult | Error, reverse?: boolean }) => {
  const tableWidth = styles.tableScrollable.maxWidth;

  const [containerWidth, setContainerWidth] = useState(tableWidth); // State for container width

  const isScrollable = containerWidth < tableWidth;

  const theme = useTheme()
  const hitResultError = hitResult instanceof Error;

  if (hitResultError) {
    return null
  }

  const hold = !hitResultError && hitResult?.shot?.relativeAngle
  const wind = !hitResultError && hitResult?.trajectory.filter((row) => row.dropAdjustment.In(Unit.MIL) <= 0.001)[1]?.windageAdjustment

  if (!hold || !wind) {
    return null
  }

  const trajectory = !hitResultError && hitResult?.trajectory
  reverse && trajectory.sort((a, b) => b.time - a.time)

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
        <Text style={{ ...tableStyles.cellText }}>
          {children}
        </Text>
      </DataTable.Title>
    )
  }

  const headerTitles = [
    "Unit",
    "Hold",
    "Wind",
  ]

  const adjUnits = [
    Unit.MIL,
    Unit.MOA,
    Unit.MRad,
    Unit.CmPer100M,
    Unit.InchesPer100Yd,
  ]

  return (

          <DataTable style={{alignSelf: "center", maxWidth: 400}}>
            <DataTable.Header style={tableStyles.row}>
              <HeaderText>{""}</HeaderText>
              {adjUnits.map((item, index) => <HeaderText key={index}>{UnitProps[item].symbol}</HeaderText>)}
            </DataTable.Header>

            <DataTable.Row style={tableStyles.row}>
              <DataTable.Cell {...headerStyle}>Hold</DataTable.Cell>
              {adjUnits.map((item, index) => <DataTable.Cell key={index} {...headerStyle}>{hold?.In(item).toFixed(UnitProps[item].accuracy)}</DataTable.Cell>)}
            </DataTable.Row>
              
            <DataTable.Row style={tableStyles.row}>
              <DataTable.Cell {...headerStyle}>Wind</DataTable.Cell>
              {adjUnits.map((item, index) => <DataTable.Cell key={index} {...headerStyle}>{wind?.In(item).toFixed(UnitProps[item].accuracy)}</DataTable.Cell>)}
            </DataTable.Row>
          </DataTable>
  );
};

const styles = StyleSheet.create({
  tableFullWidth: {
    // width: '100%', // Take full container width
    maxWidth: 400
  },
  tableScrollable: {
    maxWidth: 400, // Fixed width for scrollable table
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
    minHeight: 25,
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
