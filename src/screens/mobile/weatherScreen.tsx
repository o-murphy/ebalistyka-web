import { ScrollView, StyleSheet, View } from "react-native";
import { Appbar, FAB, Switch, Text, useTheme } from "react-native-paper";
import { useState } from "react";
import SettingsUnitCard from "../../components/cards/settingsCard";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";


export const WeatherTopAppBar = ({...props}: NativeStackHeaderProps) => {
    
    const { back, navigation } = props;

    const theme = useTheme()
    const [settingsVisible, setSettingsVisible] = useState(false)

    

    return (
        <Appbar.Header mode={"center-aligned"} style={{
            height: 48,
            backgroundColor: theme.colors.elevation.level2
        }}>
            <Appbar.BackAction onPress={() => navigation.navigate(back.title)}/>
            <Appbar.Content title="Shooting conditions"/>
            <Appbar.Action icon="cog-outline" onPress={() => setSettingsVisible(true)} />

            <SettingsUnitCard visibility={[settingsVisible, setSettingsVisible]} />

        </Appbar.Header>
    )
}


export const WeatherScreen = ({ navigation }) => {
    const theme = useTheme()

    const [usePowderSens, setUsePowderSens] = useState(false);

    const onTogglePowderSens = () => {
        console.log(!usePowderSens)
        setUsePowderSens(!usePowderSens);
    }

    const _styles = StyleSheet.create({
        scrollViewContainer: {
            flex: 1,
            backgroundColor: theme.colors.secondaryContainer,
        },
    });

    return (
        <ScrollView
            style={_styles.scrollViewContainer}
            keyboardShouldPersistTaps="always"
            alwaysBounceVertical={false}
            showsVerticalScrollIndicator={true}

            contentContainerStyle={{
                height: "60%", maxHeight: 420, 
                padding: 8,
                backgroundColor: theme.colors.elevation.level1,
                borderBottomRightRadius: 32, borderBottomLeftRadius: 32
            }}
        >
            {/* <View style={{
                height: "60%", maxHeight: 420, padding: 8,
                backgroundColor: theme.colors.elevation.level1,
                borderBottomRightRadius: 32, borderBottomLeftRadius: 32
            }}> */}

                <View style={{ flexDirection: "row" }}>
                    <FAB
                        size="small"
                        icon={"thermometer"}
                        onPress={() => console.log('cTemp')}
                        label={"15 deg"}
                        style={styles.fabStyle}
                    />
                    {/* <FAB
                        size="small"
                        icon={"windsock"}
                        onPress={() => console.log('Altitude')}
                        label={"805 m/s"}
                        style={styles.fabStyle}
                    /> */}
                </View>

                <View style={{ flexDirection: "row" }}>
                    <FAB
                        size="small"
                        icon={"water"}
                        onPress={() => console.log('Wind')}
                        label={"50 %"}
                        style={styles.fabStyle}
                    />
                    <FAB
                        size="small"
                        icon={"speedometer"}
                        onPress={() => console.log('Pressure')}
                        label={"1000 hPa"}
                        style={styles.fabStyle}
                    />

                </View>



                <View style={{ padding: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text variant="labelLarge">Use powder sensitivity</Text>
                    <Switch 
                        value={usePowderSens}
                        onValueChange={onTogglePowderSens}
                    />
                </View>

            {/* </View> */}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    fabContainer: {
        paddingHorizontal: 16,
        paddingBottom: 8,
        flexDirection: "row",
        justifyContent: "center", // Use space-between to avoid overlap
        alignItems: "center",
    },
    fabStyle: {
        flex: 1, // Allow each FAB to grow equally
        marginHorizontal: 4,
        marginVertical: 4,
        textAlign: "center",
    },
});