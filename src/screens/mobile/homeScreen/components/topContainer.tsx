import { StyleSheet } from "react-native";
import { FAB, Surface, Text } from "react-native-paper";
import ProfileTitle from "./profileTitle";
import ShotPropertiesContainer from "./shotProperties";
import { LookAngleDialog, TargetDistanceDialog, WindSpeedDialog } from "./shotPropsDialogs";

const bigFABsLabels = ['Wind speed', 'Look angle', 'Distance'];

export const TopContainerFabs = () => {
    return (
        <Surface style={styles.shotPropsFabContainer} elevation={0}>
            <WindSpeedDialog button={<FAB size="medium" icon="windsock" style={styles.shotPropsFab} />} />
            <LookAngleDialog button={<FAB size="medium" icon="angle-acute" style={styles.shotPropsFab} />} />
            <TargetDistanceDialog button={<FAB size="medium" icon="map-marker-distance" style={styles.shotPropsFab} />} />
        </Surface>
    )
}

export const TopContainer = () => {

    return (
        <Surface style={styles.topContainer} elevation={1}>
            <ProfileTitle />
            <ShotPropertiesContainer />

            <TopContainerFabs />

            <Surface style={styles.shotPropsLabelContainer} elevation={0}>
                {bigFABsLabels.map((text, index) => (
                    <Text key={index} style={styles.shotPropsLabel}>
                        {text}
                    </Text>
                ))}
            </Surface>
        </Surface>
    );
};

const styles = StyleSheet.create({
    topContainer: {
        minHeight: 320,
        minWidth: 320,
        aspectRatio: 1,
        padding: 8,
        borderBottomRightRadius: 16,
        borderBottomLeftRadius: 16,
    },
    shotPropsFabContainer: {
        flex: 2,

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