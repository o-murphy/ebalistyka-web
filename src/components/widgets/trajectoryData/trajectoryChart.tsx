import { Unit } from 'js-ballistics/dist/v2';
import { StyleSheet } from 'react-native';
import { useProfile } from '../../../context/profileContext';
import { Text } from 'react-native-paper';
import { useTheme } from '../../../context/themeContext';
import CustomChart from '../adaptiveChart';
import { usePreferredUnits } from '../../../context/preferredUnitsContext';


function findOppositeLeg(hypotenuse, angleInDegrees) {
    const angleInRadians = angleInDegrees * (Math.PI / 180);
    const oppositeLeg = hypotenuse * Math.sin(angleInRadians);
    return oppositeLeg;
}

const TrajectoryChart = () => {

    const { theme } = useTheme()
    const { hitResult } = useProfile()
    const { preferredUnits } = usePreferredUnits()


    if (hitResult instanceof Error) return (
        <Text>Can't display chart</Text>
    );

    const result = hitResult.trajectory;

    const data = {
        labels: result.map((row) => row.distance.In(preferredUnits.distance).toFixed(0)),
        datasets: [
            {
                data: result.map((row) => row.velocity.In(preferredUnits.velocity)),
                // color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
                color: () => theme.colors.primary,
            },
            {
                data: result.map(row => findOppositeLeg(
                    row.lookDistance.In(preferredUnits.drop),
                    hitResult.shot.lookAngle.In(Unit.Degree)
                )),
                color: () => "orange",
            },
            {
                data: result.map(row => findOppositeLeg(
                    row.lookDistance.In(preferredUnits.drop),
                    hitResult.shot.barrelElevation.In(Unit.Degree)
                )),
                color: () => theme.colors.errorContainer,
            },
            {
                data: result.map((row) => row.height.In(preferredUnits.drop)),
            },
        ],
        legend: [
            "Velocity",
            "Sight line",
            "Barrel line",
            "Height",
        ],
    };

    return (
        <CustomChart containerStyle={styles.customChart} data={data}
            chartProps={{
                height: 480,
                verticalLabelRotation: -90,
                xLabelsOffset: 20,
            }} />
    )
};

const styles = StyleSheet.create({
    customChart: {
        // flex: 1, justifyContent: "center"
    }
})

export default TrajectoryChart;