import { useEffect, useMemo, useState } from "react"
import { LayoutChangeEvent, StyleSheet } from "react-native"
import { FAB, Surface, Text } from "react-native-paper"
import { useNavigation } from "@react-navigation/native"
import WindDirectionPicker from "../../../../components/widgets/windDirectionPicker"
import { useCalculator } from "../../../../context/profileContext"


const ShotPropertiesContainer = () => {

    const { currentConditions, updateCurrentConditions } = useCalculator()
    const { windDirection } = currentConditions;
    const [windDir, setWindDir] = useState(windDirection || 0);
    const [layoutSize, setLayoutSize] = useState({ width: 0, height: 0 }); // Default value

    const navigation: any = useNavigation()

    useEffect(() => {
        setWindDir(windDirection);
    }, [windDirection]);

    const onWinDirChange = (value: number) => {
        setWindDir(value);
    };

    const onLayout = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        setLayoutSize({ width, height });
    };

    const onWheelTouchRelease = () => {
        updateCurrentConditions({ windDirection: windDir });
    };

    const dialDiameter = useMemo(() => Math.min(layoutSize.width, layoutSize.height), [layoutSize]);

    const windDirLabelStyle = useMemo(
        () => ({
            ...styles.wheelLabel,
            fontSize: dialDiameter / 20,
            top: layoutSize.height / 2 - dialDiameter * 0.2,
        }),
        [dialDiameter, layoutSize.height]
    );

    const smallFABs = {
        info: {
            icon: "information-outline",
            size: "small",
            variant: "secondary",
            onPress: () => navigation.navigate("ShotInfo"),
        },
        help: {
            icon: "help",
            size: "small",
            variant: "secondary",
            onPress: () => console.log('Help'),
            disabled: true
        },
        move: {
            icon: "",
            size: "small",
            variant: "secondary",
            onPress: () => console.log('<Move>'),
            disabled: true
        },
        props: {
            icon: "dots-horizontal",
            size: "small",
            variant: "secondary",
            onPress: () => console.log('Dots'),
            disabled: true
        }
    }

    return (
        <Surface style={styles.surface} elevation={0}>
            <Surface elevation={0} style={styles.columnSurface}>
                <FAB {...smallFABs.info} style={styles.fabStyle} />
                <FAB {...smallFABs.move} style={styles.fabStyle} />
            </Surface>

            <Surface style={styles.wheelSurface} onLayout={onLayout} elevation={0} >
                <Text style={windDirLabelStyle}>{"Wind\ndirection"}</Text>
                <WindDirectionPicker
                    style={styles.wheel}
                    value={windDir}
                    onChange={onWinDirChange}
                    diameter={dialDiameter}
                    onTouchEnd={onWheelTouchRelease}
                />
            </Surface>

            <Surface elevation={0} style={styles.columnSurface}>
                <FAB {...smallFABs.help} style={styles.fabStyle} />
                <FAB {...smallFABs.props} style={styles.fabStyle} />
            </Surface>

        </Surface>
    );
}


const styles = StyleSheet.create({
    surface: {
        flexDirection: "row",
        minHeight: 200,
        justifyContent: "space-between",
        margin: 16,
    },
    columnSurface: {
        flexDirection: "column",
        justifyContent: "space-between",
    },
    fabStyle: {

    },
    wheelSurface: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    wheelLabel: {
        position: "absolute",
        alignSelf: "center",
        textAlign: "center"
    },
    wheel: {
        alignSelf: "center"
    }
})


export default ShotPropertiesContainer;