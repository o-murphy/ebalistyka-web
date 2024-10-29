import { ScrollView, StyleSheet, View } from "react-native";
import { useTheme } from "../../context/themeContext";
import { Chip, FAB, Icon, Text } from "react-native-paper";
import WindDirectionPicker from "../../components/widgets/windDirectionPicker";
import { useState } from "react";

export const HomeScreen = ({ navigation }) => {
    const { theme } = useTheme();

    const [windDir, setWindDir] = useState(0)
    const [pickerDiameter, setPickerDiameter] = useState(4); // Default value

    const onWinDirChange = (value) => {
        setWindDir(value)
    }

    const _styles = StyleSheet.create({
        scrollViewContainer: {
            flex: 1,
            backgroundColor: theme.colors.secondaryContainer,
        },
    });

    const onLayout = (event) => {
        const { width, height } = event.nativeEvent.layout;
        // Set sizeMultiplier based on your logic, e.g., using width
        console.log(height)
        setPickerDiameter(height); // Adjust the divisor based on your requirement
    };

    return (
        <ScrollView
            keyboardShouldPersistTaps="always"
            alwaysBounceVertical={false}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={_styles.scrollViewContainer}
        >
            <View style={{
                height: "60%", maxHeight: 420, padding: 8,
                backgroundColor: theme.colors.elevation.level1,
                borderBottomRightRadius: 32, borderBottomLeftRadius: 32
            }}>

                <View style={{
                    flexDirection: "row", justifyContent: "center", paddingHorizontal: 16
                }}>
                    <Chip
                        closeIcon={"square-edit-outline"}
                        onClose={() => { }}
                        style={{ flex: 1, marginRight: 8 }}
                    >
                        {"<profile name>"}
                    </Chip>
                    <FAB
                        size="small"
                        animated={false}
                        icon={() => (
                            <View style={{
                                transform: [
                                    // { translateX: -1 }, // Half the width of the icon
                                    // { translateY: -4 }, // Half the height of the icon
                                    { rotate: '45deg' }, // Rotate
                                ],
                            }}>
                                <Icon size={28} source={"bullet"} color={theme.colors.secondary} />
                            </View>
                        )}
                    />
                </View>
                <View style={{
                    flex: 2, marginTop: 8,
                    // backgroundColor: theme.colors.onSecondaryContainer, 
                    borderRadius: 12,
                    flexDirection: "column", justifyContent: "space-evenly",
                    zIndex: 1,
                }}
                    onLayout={onLayout}
                >

                    <Text style={{
                        position: "absolute",
                        top: pickerDiameter / 2 - 32,
                        alignSelf: "center"
                    }} >Wind direction</Text>


                    <WindDirectionPicker
                        style={{
                            alignSelf: "center",
                            justifyContent: "center",
                            zIndex: 0, // keeps it below the FAB buttons if they overlap
                            flex: 1,
                        }}
                        value={windDir}
                        onChange={onWinDirChange}
                        diameter={pickerDiameter}
                    />

                    {/* Top-left FAB */}
                    <FAB
                        icon={"information-outline"}
                        size="small"
                        onPress={() => console.log('Info')}
                        style={{
                            position: "absolute",
                            top: 28,
                            left: 28,
                        }}
                    />

                    {/* Top-right FAB */}
                    <FAB
                        icon={"help"}
                        size="small"
                        onPress={() => console.log('Help')}
                        style={{
                            position: "absolute",
                            top: 28,
                            right: 28,
                        }}
                    />

                    {/* Bottom-left FAB */}
                    <FAB
                        icon={""}
                        size="small"
                        onPress={() => console.log('')}
                        style={{
                            position: "absolute",
                            bottom: 28,
                            left: 28,
                        }}
                    />

                    {/* Bottom-right FAB */}
                    <FAB
                        icon={"dots-horizontal"}
                        size="small"
                        onPress={() => console.log('Dots')}
                        style={{
                            position: "absolute",
                            bottom: 28,
                            right: 28,
                        }}
                    />


                </View>

                <View style={[styles.fabContainer]}>
                    <FAB
                        size="small"
                        icon={"windsock"}
                        onPress={() => console.log('Wind')}
                        label={"805 m/s"}
                        style={styles.fabStyle}
                    />
                    <FAB
                        size="small"
                        icon={"angle-acute"}
                        onPress={() => console.log('Angle')}
                        label={"0 deg"}
                        style={styles.fabStyle}
                    />
                    <FAB
                        size="small"
                        icon={"map-marker-distance"}
                        onPress={() => console.log('Distance')}
                        label={"500 m"}
                        style={styles.fabStyle}
                    />
                </View>

                <View style={[styles.fabContainer]}>
                    <Text style={styles.fabStyle} >Wind speed</Text>
                    <Text style={styles.fabStyle} >Look angle</Text>
                    <Text style={styles.fabStyle} >Distance</Text>
                </View>

            </View>
            <View style={{height: "50%", maxHeight: "50%", overflow: "hidden"}}>
                <Text variant="displayLarge">
                    Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder Placeholder
                </Text>
            </View>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    fabContainer: {
        paddingHorizontal: 12,
        paddingBottom: 8,
        flexDirection: "row",
        justifyContent: "center", // Use space-between to avoid overlap
        alignItems: "center",
    },
    fabStyle: {
        flex: 1, // Allow each FAB to grow equally
        marginHorizontal: 4,
        textAlign: "center",
    },
});