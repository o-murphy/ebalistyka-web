import { Platform, ScrollView, StyleSheet } from "react-native";
import { TopContainer } from "./components/topContainer";
import { BotContainer } from "./components/botContainer";
import { useCalculator } from "../../../context/profileContext";
import { useEffect, useState } from "react";
import { Appbar, useTheme } from "react-native-paper";
import FileUploadButton from "../../../components/widgets/fileUpdoader";
import SettingsUnitCard from "../../../components/cards/settingsCard";
import { useThemeSwitch } from "../../../context/themeContext";
import { DeviceType, getDeviceTypeAsync } from "expo-device";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";



const HomeScreenTopAppBar = ({...props}: NativeStackHeaderProps) => {

    const { navigation } = props;

    const [devType, setDevType] = useState(DeviceType.PHONE)

    useEffect(() => {
      getDeviceTypeAsync().then((deviceType) => {
        setDevType(deviceType);
      });
    }, []);

    const { toggleNightMode } = useThemeSwitch()

    const theme = useTheme()

    // const [settingsVisible, setSettingsVisible] = useState(false)

    return (
        <Appbar.Header mode={"center-aligned"} style={{
            height: 48,
            backgroundColor: theme.colors.elevation.level2
        }}>
            <Appbar.Action
                icon={theme.dark ? "brightness-7" : "brightness-3"}
                onPress={() => toggleNightMode()}
            />
            <Appbar.Content title="E-Balistyka" />

            {Platform.OS === 'web' && <FileUploadButton />}

            {/* <Appbar.Action icon="cog-outline" onPress={() => setSettingsVisible(true)} /> */}
            <Appbar.Action icon="cog-outline" onPress={() => navigation.navigate("SettingsScreen")} />

            {/* <SettingsUnitCard visibility={[settingsVisible, setSettingsVisible]} /> */}

        </Appbar.Header>
    )
}

export default HomeScreenTopAppBar;


export const HomeScreen = ({ navigation = null }) => {
    const theme = useTheme();
    const { profileProperties, currentConditions, fire } = useCalculator()

    useEffect(() => {
        if (profileProperties && currentConditions) {
            fire()
        }
    }, [profileProperties, currentConditions])

    const _styles = StyleSheet.create({
        scrollView: {
            flex: 1, 
            paddingBottom: 64, 
            backgroundColor: theme.colors.secondaryContainer
        },
        scrollViewContainer: {
            // backgroundColor: theme.colors.secondaryContainer
        },
    });

    return (
        <ScrollView
            style={_styles.scrollView}
            keyboardShouldPersistTaps="always"
            alwaysBounceVertical={false}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={_styles.scrollViewContainer}
        >
            <TopContainer />
            <BotContainer />
        </ScrollView>
    )
}

