import { useEffect, useMemo, useState } from "react"
import { LayoutChangeEvent, StyleSheet, View } from "react-native"
import { FAB, Text, useTheme } from "react-native-paper"
import { useNavigation } from "@react-navigation/native"
import WindDirectionPicker from "../../../../components/widgets/windDirectionPicker"
import { useCalculator } from "../../../../context/profileContext"


const ShotPropertiesContainer = () => {

    const theme = useTheme()
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
            ...styles.windDirLabel,
            color: theme.colors.onSecondaryContainer,
            fontSize: dialDiameter / 20,
            top: layoutSize.height / 2 - dialDiameter * 0.2,
        }),
        [theme, dialDiameter, layoutSize.height]
    );


    const smallFABs = [
        {
            icon: "information-outline",
            size: "small",
            variant: "secondary",
            onPress: () => navigation.navigate("ShotInfo"),
            style: { position: "absolute", top: 28, left: 28 },
        },
        {
            icon: "help",
            size: "small",            
            variant: "secondary",
            onPress: () => console.log('Help'),
            style: { position: "absolute", top: 28, right: 28, },
            disabled: true
        },
        {
            icon: "",
            size: "small",
            variant: "secondary",
            onPress: () => console.log('<Move>'),
            style: { position: "absolute", bottom: 28, left: 28, },
            disabled: true
        },
        {
            icon: "dots-horizontal",
            size: "small",
            variant: "secondary",
            onPress: () => console.log('Dots'),
            style: { position: "absolute", bottom: 28, right: 28, },
            disabled: true
        }
    ]

    return (
        <View style={styles.windDirPickerContainer} onLayout={onLayout}>
            <Text style={windDirLabelStyle}>{"Wind\ndirection"}</Text>
            <WindDirectionPicker
                style={styles.windDirPicker}
                value={windDir}
                onChange={onWinDirChange}
                diameter={dialDiameter}
                onTouchEnd={onWheelTouchRelease}
            />
            {smallFABs.map((fabProps, index) => (
                <FAB key={index} {...fabProps} />
            ))}
        </View>
    );
}


const styles = StyleSheet.create({
    windDirPickerContainer: {
        flex: 2,
        marginTop: 8,
        borderRadius: 12,
        flexDirection: "column",
        justifyContent: "space-evenly",
        zIndex: 1,
    },
    windDirPicker: {
        alignSelf: "center",
        justifyContent: "center",
        zIndex: 0, // keeps it below the FAB buttons if they overlap
        flex: 1,
    },
    windDirLabel: {
        position: "absolute",
        alignSelf: "center",
        textAlign: "center"
    },
})


export default ShotPropertiesContainer;