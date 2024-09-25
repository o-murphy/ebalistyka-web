import { DataTable, Text } from 'react-native-paper';
import {
    preferredUnits, TrajectoryData, UnitProps
} from 'js-ballistics/dist/v2';
import { useProfile } from '../../context/profileContext';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../context/themeContext';
import InputCard from '../cards/inputCard';


// Arrow function component
const TrajectoryTable = () => {

    const { hitResult } = useProfile()
    const { theme } = useTheme()

    // if (!hitResult) return (
    //     <Text>Can't display table</Text>
    // );

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
                {/* <View style={tableStyles.headerTextContainer}> */}
                <Text style={tableStyles.cellText}>
                    {children}
                </Text>
                {/* </View> */}
            </DataTable.Title>
        )
    }

    return (
        <InputCard title='Trajectory' >
            <DataTable >
                <DataTable.Header style={tableStyles.row}>
                    <HeaderText >Time, s</HeaderText>
                    <HeaderText >Range, {UnitProps[preferredUnits.distance].symbol}</HeaderText>
                    <HeaderText >V, {UnitProps[preferredUnits.velocity].symbol}</HeaderText>
                    <HeaderText >Mach</HeaderText>
                    <HeaderText >Height, {UnitProps[preferredUnits.drop].symbol}</HeaderText>
                    <HeaderText >Drop, {UnitProps[preferredUnits.drop].symbol}</HeaderText>
                    <HeaderText >Drop adj., {UnitProps[preferredUnits.adjustment].symbol}</HeaderText>
                    <HeaderText >Windage, {UnitProps[preferredUnits.drop].symbol}</HeaderText>
                    <HeaderText >Wind. adj., {UnitProps[preferredUnits.adjustment].symbol}</HeaderText>
                    <HeaderText >Look dst., {UnitProps[preferredUnits.distance].symbol}</HeaderText>
                    <HeaderText >Angle, {UnitProps[preferredUnits.angular].symbol}</HeaderText>
                    <HeaderText >Density</HeaderText>
                    <HeaderText >Drag</HeaderText>
                    <HeaderText >Energy, {UnitProps[preferredUnits.energy].symbol}</HeaderText>
                    <HeaderText >OGW, {UnitProps[preferredUnits.ogw].symbol}</HeaderText>
                </DataTable.Header>

                {hitResult?.trajectory.map((row, index) => (
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
                        <DataTable.Cell {...dataRowStyle(row)}>{row.ogw.In(preferredUnits.ogw).toFixed(0)}</DataTable.Cell>
                    </DataTable.Row>
                ))}

            </DataTable>
        </InputCard>
    )
};

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