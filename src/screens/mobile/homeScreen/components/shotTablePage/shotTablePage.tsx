import { Table, Row, Col, TableWrapper } from 'react-native-table-component';
import { StyleSheet } from "react-native";
import { Divider, useTheme } from "react-native-paper";
import { HitResult, Unit, UnitProps } from "js-ballistics/dist/v2";
import { useCalculator, useAppSettings, usePreferredUnits } from "../../../../../context";
import { ScrollViewSurface } from '../../../../../components/widgets';

const adjustmentSort = (closest, item) => {
    return Math.abs(item.dropAdjustment.rawValue) < Math.abs(closest.dropAdjustment.rawValue) ? item : closest;
};


const MiniTable = ({ header, rows, active = 0 }) => {
    const theme = useTheme()
    const headers = [header]

    rows = rows[0].map((item, index) => [item, rows[1][index]])

    return (
        <Table style={{ marginBottom: 4 }}>
            <Row data={headers} style={styles.header} textStyle={[styles.text, { color: theme.colors.onSurfaceVariant }]} />
            <TableWrapper style={{ flexDirection: 'row' }}>
                {rows.map((rowData, index) =>
                    <Col
                        key={index}
                        data={rowData}
                        style={styles.header}
                        textStyle={[styles.text, { color: active === index ? theme.colors.tertiary : theme.colors.onSurfaceVariant }]}
                    />
                )}
            </TableWrapper>
        </Table>
    )
}


const ShotTablePage = () => {
    const { adjustedResult } = useCalculator()
    const { preferredUnits: pu } = usePreferredUnits()
    const { homeScreenDistanceStep } = useAppSettings()

    if (!(adjustedResult instanceof HitResult)) {
        return null
    }

    const hold = adjustedResult.shot.relativeAngle
    // const trajectoryStepRaw = UNew.Meter(10).rawValue
    const trajectoryStepRaw = homeScreenDistanceStep.value.rawValue
    // const trajectoryRangeRaw = UNew.Meter(currentConditions?.targetDistance + 1).rawValue
    const trajectoryRangeRaw = adjustedResult?.trajectory[adjustedResult.trajectory.length - 1].distance.rawValue

    let trajectory = [];

    for (let i = 0; i <= trajectoryRangeRaw; i += trajectoryStepRaw) {
        const closestValue = adjustedResult?.trajectory.reduce((closest, item) => {
            const itemDifference = Math.abs(item.distance.rawValue - i);
            const closestDifference = Math.abs(closest.distance.rawValue - i);
            return itemDifference < closestDifference ? item : closest;
        }, adjustedResult.trajectory[0]); // Start with the first element as the initial closest

        if (closestValue) {
            trajectory.push(closestValue);
        }
    }

    // trajectory = trajectory.filter(row => row.distance.rawValue <= trajectoryRangeRaw)

    const holdRow = trajectory.slice(1).reduce(adjustmentSort, trajectory[1]);
    const holdRowIndex = trajectory.indexOf(holdRow);
    const startIndex = Math.max(0, holdRowIndex - 4);
    const endIndex = holdRowIndex + 2;

    const tPart = trajectory.slice(startIndex, endIndex);

    const tPartHoldIdx = tPart.indexOf(holdRow)


    const distances = tPart.map((row, index) => row.distance.In(pu.distance).toFixed(0) + ` ${UnitProps[pu.distance].symbol}`);
    const heights = tPart.map((row, index) => row.height.In(pu.drop).toFixed(1));
    const dropAdjustmentMil = tPart.map((row, index) => row.dropAdjustment.In(Unit.MIL).toFixed(2));
    const dropAdjustmentMOA = tPart.map((row, index) => row.dropAdjustment.In(Unit.MOA).toFixed(2));
    const holdMil = tPart.map((row, index) => (
        hold.In(Unit.MIL) - row.dropAdjustment.In(Unit.MIL)
    ).toFixed(2));
    const holdMOA = tPart.map((row, index) => (
        hold.In(Unit.MOA) - row.dropAdjustment.In(Unit.MOA)
    ).toFixed(2));

    const windage = tPart.map((row, index) => row.windage.In(pu.drop).toFixed(1));
    const windAdjMil = tPart.map((row, index) => row.windageAdjustment.In(Unit.MIL).toFixed(2));
    const windAdjMOA = tPart.map((row, index) => row.windageAdjustment.In(Unit.MOA).toFixed(2));

    const velocity = tPart.map((row, index) => row.velocity.In(pu.velocity).toFixed(0));
    const time = tPart.map((row, index) => row.time.toFixed(3));
    const energy = tPart.map((row, index) => row.energy.In(pu.energy).toFixed(0));


    return (

        <ScrollViewSurface
            style={styles.scrollView}
            keyboardShouldPersistTaps={"always"}
            alwaysBounceVertical={false}
            showsVerticalScrollIndicator={true}
            surfaceStyle={styles.scrollViewContainer}
            elevation={0}
        >
            <MiniTable
                header={"Trajectory height" + `, ${UnitProps[pu.drop].symbol}`}
                rows={[distances, heights]}
                active={tPartHoldIdx}
            />

            <Divider />

            <MiniTable
                header={"Drop adjustment" + `, ${UnitProps[Unit.MIL].symbol}`}
                rows={[distances, dropAdjustmentMil]}
                active={tPartHoldIdx}
            />

            <Divider />

            <MiniTable
                header={"Drop adjustment" + `, ${UnitProps[Unit.MOA].symbol}`}
                rows={[distances, dropAdjustmentMOA]}
                active={tPartHoldIdx}
            />

            <Divider />

            <MiniTable
                header={"Hold" + `, ${UnitProps[Unit.MIL].symbol}`}
                rows={[distances, holdMil]}
                active={tPartHoldIdx}
            />

            <Divider />

            <MiniTable
                header={"Hold" + `, ${UnitProps[Unit.MOA].symbol}`}
                rows={[distances, holdMOA]}
                active={tPartHoldIdx}
            />
            <Divider />

            <MiniTable
                header={"Windage" + `, ${UnitProps[pu.drop].symbol}`}
                rows={[distances, windage]}
                active={tPartHoldIdx}
            />
            <Divider />

            <MiniTable
                header={"Windage adjustment" + `, ${UnitProps[Unit.MIL].symbol}`}
                rows={[distances, windAdjMil]}
                active={tPartHoldIdx}
            />
            <Divider />

            <MiniTable
                header={"Windage adjustment" + `, ${UnitProps[Unit.MOA].symbol}`}
                rows={[distances, windAdjMOA]}
                active={tPartHoldIdx}
            />
            <Divider />

            <MiniTable
                header={"Velocity" + `, ${UnitProps[pu.velocity].symbol}`}
                rows={[distances, velocity]}
                active={tPartHoldIdx}
            />
            <Divider />

            <MiniTable
                header={"Time" + `, s`}
                rows={[distances, time]}
                active={tPartHoldIdx}
            />
            <Divider />

            <MiniTable
                header={"Energy" + `, ${UnitProps[pu.velocity].symbol}`}
                rows={[distances, energy]}
                active={tPartHoldIdx}
            />


        </ScrollViewSurface>
    )
}


const styles = StyleSheet.create({
    scrollView: {
        paddingBottom: 16,
        paddingHorizontal: 32,
        // aspectRatio: 1,
        // flex: 1
        height: 200
    },
    scrollViewContainer: {
        paddingBottom: 16,
        borderBottomRightRadius: 16,
        borderBottomLeftRadius: 16,
    },

    header: {
        height: 32,
    },
    text: {
        textAlign: 'center',
        fontWeight: 'bold'
    },
})


export default ShotTablePage;