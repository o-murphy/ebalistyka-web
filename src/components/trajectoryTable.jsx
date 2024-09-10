import { StyleSheet } from 'react-native-web';
import { Table, Row } from 'react-native-table-component';
import {
    Atmo, Shot, UNew
} from 'js-ballistics/dist/v2';



// Arrow function component
const TrajectoryTable = ({ calculatorData }) => {
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

    const result = hit.trajectory.map((row) => row.formatted());

    return (
        <Table borderStyle={{ borderColor: '#c8e1ff', borderWidth: 1 }}>
            <Row data={headers} style={styles.header} />
            {result.map((rowData, index) => (
                <Row key={index} data={rowData} />
            ))}
        </Table>
    )
};



const headers = [
    'time',
    'distance',
    'velocity',
    'mach',
    'height',
    'targetDrop',
    'dropAdjustment',
    'windage',
    'windageAdjustment',
    'lookDistance',
    'angle',
    'densityFactor',
    'drag',
    'energy',
    'ogw',
    'flag',
]

const styles = StyleSheet.create({
    header: {
        height: 36,
        backgroundColor: '#f1f8ff',
    },
    text: {
        textAlign: 'center',
        padding: 8,
    },
});


export default TrajectoryTable;