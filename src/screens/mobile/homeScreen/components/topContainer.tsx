import { StyleSheet, View } from "react-native";
import { FAB, Text, useTheme } from "react-native-paper";
import ProfileTitle from "./profileTitle";
import ShotPropertiesContainer from "./shotProperties";
import { LookAngleDialog, TargetDistanceDialog, WindSpeedDialog } from "./shotPropsDialogs";

const bigFABsLabels = ['Wind speed', 'Look angle', 'Distance'];

const TopContainer = () => {
    const theme = useTheme();

    return (
        <View style={[styles.topContainer, { backgroundColor: theme.colors.elevation.level1 }]}>
            <ProfileTitle />
            <ShotPropertiesContainer />

            <View style={styles.shotPropsFabContainer}>
                <WindSpeedDialog button={<FAB size="medium" icon="windsock" style={styles.shotPropsFab} />} />
                <LookAngleDialog button={<FAB size="medium" icon="angle-acute" style={styles.shotPropsFab} />} />
                <TargetDistanceDialog button={<FAB size="medium" icon="map-marker-distance" style={styles.shotPropsFab} />} />
            </View>

            <View style={styles.shotPropsLabelContainer}>
                {bigFABsLabels.map((text, index) => (
                    <Text key={index} style={styles.shotPropsLabel}>
                        {text}
                    </Text>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    topContainer: {
        minHeight: 420,
        padding: 8,
        borderBottomRightRadius: 32,
        borderBottomLeftRadius: 32,
    },
    shotPropsFabContainer: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    shotPropsFab: {
        flex: 1,
        marginHorizontal: 4,
    },
    shotPropsLabelContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 12,
    },
    shotPropsLabel: {
        flex: 1,
        textAlign: "center",
        marginHorizontal: 4,
    },
});

export default TopContainer;