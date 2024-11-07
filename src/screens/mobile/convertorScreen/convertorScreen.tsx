import { StyleSheet, View } from "react-native";
import { Divider, List, Surface, useTheme } from "react-native-paper";
import { ScreenBackground } from "../components";
import ScrollViewSurface from "../components/scrollViewSurface";

const ConvertorContent = () => {
    const theme = useTheme();

    // Array of conversion items
    const conversionItems = [
        { title: "Distance", icon: "map-marker-distance", action: () => console.log("d conv") },
        { title: "Velocity", icon: "speedometer", action: () => console.log("v conv") },
        { title: "Length", icon: "ruler", action: () => console.log("l conv") },
        { title: "Weight", icon: "weight", action: () => console.log("w conv") },
        { title: "Pressure", icon: "gauge", action: () => console.log("p conv") },
        { title: "Temperature", icon: "thermometer", action: () => console.log("t conv") },
        { title: "Angular", icon: "angle-acute", action: () => console.log("a conv") },
    ];

    return (
            <ScrollViewSurface style={styles.scrollView} surfaceStyle={styles.scrollViewContainer}>
                <List.Section>
                    {conversionItems.map((item, index) => (
                        <Surface key={index} elevation={0}>
                            <List.Item
                                title={item.title}
                                left={props => <List.Icon {...props} icon={item.icon} />}
                                onPress={item.action}
                            />
                            {index < conversionItems.length - 1 && <Divider />}
                        </Surface>
                    ))}
                </List.Section>
            </ScrollViewSurface>
    );
};


const ConvertorScreen = ({ navigation }) => {
    return (
        <ScreenBackground>
            <ConvertorContent />
        </ScreenBackground>
    )
}


const styles = StyleSheet.create({
    scrollView: {
        paddingBottom: 32,
    },
    scrollViewContainer: {
        overflow: "hidden",
        borderBottomRightRadius: 16,
        borderBottomLeftRadius: 16,
    },
});


export default ConvertorScreen;
