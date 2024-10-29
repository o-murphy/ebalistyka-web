import { StyleSheet, View } from "react-native"
import WindDirectionPicker from "../../../../components/widgets/windDirectionPicker"
import { Chip, FAB, Icon, Text } from "react-native-paper"
import { useState } from "react"
import { useNavigation } from "@react-navigation/native"
import { useTheme } from "../../../../context/themeContext"
import { useCalculator } from "../../../../context/profileContext"



export const TopContainer = () => {

    const { theme } = useTheme()
    const { profileProperties } = useCalculator()
    const [windDir, setWindDir] = useState(0)
    const [pickerDiameter, setPickerDiameter] = useState(4); // Default value

    const navigation: any = useNavigation()

    const onWinDirChange = (value) => {
        setWindDir(value)
    }

    const onLayout = (event) => {
        const { width, height } = event.nativeEvent.layout;
        // Set sizeMultiplier based on your logic, e.g., using width
        console.log("Wind pick layout", height, width)
        setPickerDiameter(Math.min(height, width)); // Adjust the divisor based on your requirement
    };

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

    const bigFABs = [
        {
            size: "medium",
            icon: "windsock",
            onPress: () => console.log('Wind'),
            label: "0 m/s",
            style: styles.shotPropsFab
        },
        {
            size: "medium",
            icon: "angle-acute",
            onPress: () => console.log('Angle'),
            label: "0 deg",
            style: styles.shotPropsFab
        },
        {
            size: "medium",
            icon: "map-marker-distance",
            onPress: () => console.log('Distance'),
            label: "500 m",
            style: styles.shotPropsFab
        },
    ]

    const bigFABsLabels = [
        'Wind speed',
        'Look angle',
        'Distance',
    ]

    return (
        <View style={[styles.topContainer, { backgroundColor: theme.colors.elevation.level1 }]}>

            <View style={{
                flexDirection: "row", justifyContent: "center", paddingHorizontal: 16
            }}>
                <Chip
                    closeIcon={"square-edit-outline"}
                    onClose={() => { }}
                    style={styles.chipStyle}
                >
                    {`${profileProperties?.profileName} ${profileProperties?.bulletName}`}
                </Chip>
                <FAB
                    size="small"
                    mode={"flat"}
                    animated={false}
                    icon={() => (
                        <View style={styles.bulletIconStyle}>
                            <Icon size={28} source={"bullet"} color={theme.colors.secondary} />
                        </View>
                    )}
                />
            </View>

            <View style={styles.windDirPickerContainer}
                onLayout={onLayout}
            >
                <Text style={[styles.windDirLabel, { fontSize: pickerDiameter / 20, top: pickerDiameter * 0.30 }]} >{"Wind\ndirection"}</Text>
                <WindDirectionPicker
                    style={styles.windDirPicker}
                    value={windDir}
                    onChange={onWinDirChange}
                    diameter={pickerDiameter}
                />
                {smallFABs.map((props, index) => <FAB key={`${index}`} {...props} />)}
            </View>

            <View style={[styles.shotPropsFabContainer]}>
                {bigFABs.map((props, index) => <FAB key={`${index}`} {...props} />)}
            </View>

            <View style={[styles.shotPropsFabContainer]}>
                {bigFABsLabels.map((text, index) => <Text key={`${index}`} style={styles.shotPropsFab} >{text}</Text>)}
            </View>

        </View>
    )
}


const styles = StyleSheet.create({
    topContainer: {
        // minHeight: 360, maxHeight: 420, 
        height: "55%",
        padding: 8,
        borderBottomRightRadius: 32, borderBottomLeftRadius: 32
    },
    chipStyle: { flex: 1, marginRight: 8, justifyContent: "center", alignItems: "center" },
    bulletIconStyle: {
        transform: [
            // { translateX: -1 }, // Half the width of the icon
            // { translateY: -4 }, // Half the height of the icon
            { rotate: '45deg' }, // Rotate
        ],
    },
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
    shotPropsFabContainer: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        flexDirection: "row",
        justifyContent: "center", // Use space-between to avoid overlap
        alignItems: "center",
    },
    shotPropsFab: {
        flex: 1, // Allow each FAB to grow equally
        marginHorizontal: 4,
        textAlign: "center",
    },
});