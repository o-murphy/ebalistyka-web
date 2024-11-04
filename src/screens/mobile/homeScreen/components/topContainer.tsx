import { StyleSheet, View } from "react-native"
import { FAB, Text, useTheme } from "react-native-paper"
import { ProfileTitle } from "./profileTitle"
import { ShotPropertiesContainer } from "./shotProperties"
import { LookAngleDialog, TargetDistanceDialog, WindSpeedDialog } from "./shotPropsDialogs"

const bigFABsLabels = [
    'Wind speed',
    'Look angle',
    'Distance',
]

export const TopContainer = () => {

    const theme = useTheme()

    const windSpeedProps = {
        size: "medium",
        icon: "windsock",
        style: styles.shotPropsFab,
    }

    const lookAngleProps = {
        size: "medium",
        icon: "angle-acute",
        style: styles.shotPropsFab
    }

    const targetDistanceProps = {
        size: "medium",
        icon: "map-marker-distance",
        style: styles.shotPropsFab
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
                <WindSpeedDialog button={<FAB {...windSpeedProps} />}/>
                <LookAngleDialog button={<FAB {...lookAngleProps} />}/>
                <TargetDistanceDialog button={<FAB {...targetDistanceProps} />}/>
            </View>

            <View style={styles.shotPropsFabContainer}>
                {bigFABsLabels.map((text, index) => <Text key={`${index}`} style={styles.shotPropsFab} >{text}</Text>)}
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    topContainer: {
        minHeight: 420,
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