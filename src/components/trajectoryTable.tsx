import { DataTable, Text } from 'react-native-paper';
import Calculator, {
    Weapon, Ammo, Atmo, preferredUnits, Shot, TrajectoryData, UNew,
    UnitProps
} from 'js-ballistics/dist/v2';
import { StyleSheet } from 'react-native';


// Arrow function component
const TrajectoryTable = ({ calculatorData }: {calculatorData: {weapon: Weapon, ammo: Ammo, calc: Calculator}}) => {
    if (!calculatorData) return (
        <Text>Can't display table</Text>
    );

    const { weapon, ammo, calc } = calculatorData;
    const atmo = Atmo.icao({});
    const targetShot = new Shot({
        weapon: weapon,
        ammo: ammo,
        atmo: atmo,
        lookAngle: UNew.MIL(5),
    });

    const hit = calc.fire({
        shot: targetShot,
        trajectoryRange: UNew.Meter(1001),
        trajectoryStep: UNew.Meter(100),
    });

    const result: TrajectoryData[] = hit.trajectory

    const isZero = (row: TrajectoryData): Object => {
        return {
            textStyle: {
                color: row.distance.In(preferredUnits.distance).toFixed(0) === '100' ? "red" : 'white',
                fontSize: 12
            },
        }
    }

    return (
        <DataTable>
            <DataTable.Header>
                <DataTable.Title>Time, s</DataTable.Title>
                <DataTable.Title>Range, {UnitProps[preferredUnits.distance].symbol}</DataTable.Title>
                <DataTable.Title>V, {UnitProps[preferredUnits.velocity].symbol}</DataTable.Title>
                <DataTable.Title>Mach</DataTable.Title>
                <DataTable.Title>Height, {UnitProps[preferredUnits.drop].symbol}</DataTable.Title>
                <DataTable.Title>Drop, {UnitProps[preferredUnits.drop].symbol}</DataTable.Title>
                <DataTable.Title>Drop adj., {UnitProps[preferredUnits.adjustment].symbol}</DataTable.Title>
                <DataTable.Title>Windage, {UnitProps[preferredUnits.drop].symbol}</DataTable.Title>
                <DataTable.Title>Wind. adj., {UnitProps[preferredUnits.adjustment].symbol}</DataTable.Title>
                <DataTable.Title>Look dst., {UnitProps[preferredUnits.distance].symbol}</DataTable.Title>
                <DataTable.Title>Angle, {UnitProps[preferredUnits.angular].symbol}</DataTable.Title>
                <DataTable.Title>Density</DataTable.Title>
                <DataTable.Title>Drag</DataTable.Title>
                <DataTable.Title>Energy, {UnitProps[preferredUnits.energy].symbol}</DataTable.Title>
                <DataTable.Title>OGW, {UnitProps[preferredUnits.ogw].symbol}</DataTable.Title>
                {/* <DataTable.Title>Flag</DataTable.Title> */}
            </DataTable.Header>

            {result.map((row, index) => (
                <DataTable.Row key={index} >
                    {/* <DataTable.Cell>{row.name}</DataTable.Cell> */}
                    <DataTable.Cell {...isZero(row)}>{row.time.toFixed(3)}</DataTable.Cell>
                    <DataTable.Cell {...isZero(row)}>{(row.distance).In(preferredUnits.distance).toFixed(0)}</DataTable.Cell>
                    <DataTable.Cell {...isZero(row)}>{row.velocity.In(preferredUnits.velocity).toFixed(0)}</DataTable.Cell>
                    <DataTable.Cell {...isZero(row)}>{row.mach.toFixed(2)}</DataTable.Cell>
                    <DataTable.Cell {...isZero(row)}>{row.height.In(preferredUnits.drop).toFixed(1)}</DataTable.Cell>
                    <DataTable.Cell {...isZero(row)}>{row.targetDrop.In(preferredUnits.drop).toFixed(1)}</DataTable.Cell>
                    <DataTable.Cell {...isZero(row)}>{row.dropAdjustment.In(preferredUnits.adjustment).toFixed(2)}</DataTable.Cell>
                    <DataTable.Cell {...isZero(row)}>{row.windage.In(preferredUnits.drop).toFixed(1)}</DataTable.Cell>
                    <DataTable.Cell {...isZero(row)}>{row.windageAdjustment.In(preferredUnits.adjustment).toFixed(2)}</DataTable.Cell>
                    <DataTable.Cell {...isZero(row)}>{row.lookDistance.In(preferredUnits.distance).toFixed(0)}</DataTable.Cell>
                    <DataTable.Cell {...isZero(row)}>{row.angle.In(preferredUnits.angular).toFixed(2)}</DataTable.Cell>
                    <DataTable.Cell {...isZero(row)}>{row.densityFactor.toFixed(2)}</DataTable.Cell>
                    <DataTable.Cell {...isZero(row)}>{row.drag.toFixed(3)}</DataTable.Cell>
                    <DataTable.Cell {...isZero(row)}>{row.energy.In(preferredUnits.energy).toFixed(0)}</DataTable.Cell>
                    <DataTable.Cell {...isZero(row)}>{row.ogw.In(preferredUnits.ogw).toFixed(0)}</DataTable.Cell>
                    {/* <DataTable.Cell {...isZero(row)}>{row.flag}</DataTable.Cell> */}
                </DataTable.Row>
            ))}

        </DataTable>
    )
};

export default TrajectoryTable;