import { StyleSheet, View } from "react-native"
import { FAB, Text } from "react-native-paper"
import { useTheme } from "../../../../context/themeContext"
import { ProfileTitle } from "./profileTitle"
import { ShotPropertiesContainer } from "./shotProperties"
import { LookAngleDialog, TargetDistanceDialog, WindSpeedDialog } from "./shotPropsDialogs"

const bigFABsLabels = [
    'Wind speed',
    'Look angle',
    'Distance',
]

export const TopContainer = () => {

    const { theme } = useTheme()

    const bigFABs = {
        windSpeed: {
            size: "medium",
            icon: "windsock",
            style: styles.shotPropsFab
        },
        lookAngle: {
            size: "medium",
            icon: "angle-acute",
            style: styles.shotPropsFab
        },
        targetDistance: {
            size: "medium",
            icon: "map-marker-distance",
            style: styles.shotPropsFab
        },
    }

    const topContainerStyle = {
        ...styles.topContainer, 
        backgroundColor: theme.colors.elevation.level1
    }

    return (
        <View style={topContainerStyle}>
            <ProfileTitle />
            <ShotPropertiesContainer />

            <View style={styles.shotPropsFabContainer}>
                <WindSpeedDialog button={<FAB {...bigFABs['windSpeed']} />}/>
                <LookAngleDialog button={<FAB {...bigFABs['lookAngle']} />}/>
                <TargetDistanceDialog button={<FAB {...bigFABs['targetDistance']} />}/>
            </View>

            <View style={styles.shotPropsFabContainer}>
                {bigFABsLabels.map((text, index) => <Text key={`${index}`} style={styles.shotPropsFab} >{text}</Text>)}
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    topContainer: {
        minHeight: 500,
        padding: 8,
        borderBottomRightRadius: 32, borderBottomLeftRadius: 32
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