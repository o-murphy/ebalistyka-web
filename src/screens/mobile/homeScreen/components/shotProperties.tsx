import { StyleSheet, View } from "react-native"
import { FAB, Text } from "react-native-paper"
import { useNavigation } from "@react-navigation/native"
import WindDirectionPicker from "../../../../components/widgets/windDirectionPicker"
import { useEffect, useState } from "react"
import { useCalculator } from "../../../../context/profileContext"



export const ShotPropertiesContainer = () => {

    const { currentConditions, updateCurrentConditions } = useCalculator()
    const [windDir, setWindDir] = useState(0)
    const [layoutSize, setLayoutSize] = useState({ width: 0, height: 0 }); // Default value

    const navigation: any = useNavigation()

    useEffect(() => {
        setWindDir(currentConditions?.windDirection)
    }, [currentConditions?.windDirection])


    const onWinDirChange = (value) => {
        setWindDir(value)
    }

    const onLayout = (event) => {
        const { width, height } = event.nativeEvent.layout;
        // Set sizeMultiplier based on your logic, e.g., using width
        setLayoutSize({ width, height }); // Adjust the divisor based on your requirement
    };

    const onWheelTouchRelease = () => {
        updateCurrentConditions({windDirection: windDir})
    }


    const dialDiameter = Math.min(layoutSize.width, layoutSize.height)

    const windDirLabelStyle = {
        ...styles.windDirLabel, 
        fontSize: dialDiameter / 20, 
        top: (layoutSize.height / 2) - dialDiameter * 0.2
    }

    const smallFABs = [
        {
            icon: "information-outline",
            size: "small",
            onPress: () => navigation.navigate("ShotInfo"),
            style: { position: "absolute", top: 28, left: 28 }
        },
        {
            icon: "help",
            size: "small",
            onPress: () => console.log('Help'),
            style: { position: "absolute", top: 28, right: 28, }
        },
        {
            icon: "",
            size: "small",
            onPress: () => console.log('<Move>'),
            style: { position: "absolute", bottom: 28, left: 28, }
        },
        {
            icon: "dots-horizontal",
            size: "small",
            onPress: () => console.log('Dots'),
            style: { position: "absolute", bottom: 28, right: 28, }
        }
    ]

    return (
        <View style={styles.windDirPickerContainer}
        onLayout={onLayout}
    >
        <Text style={windDirLabelStyle} >{"Wind\ndirection"}</Text>
        <WindDirectionPicker
            style={styles.windDirPicker}
            value={windDir}
            onChange={onWinDirChange}
            diameter={dialDiameter}

            onTouchEnd={onWheelTouchRelease}
        />
        {smallFABs.map((props, index) => <FAB key={index} {...props} />)}
    </View>
    )
}


const styles = StyleSheet.create({
    windDirPickerContainer: {
        flex: 2, marginTop: 8,
        borderRadius: 12,
        flexDirection: "column", justifyContent: "space-evenly",
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