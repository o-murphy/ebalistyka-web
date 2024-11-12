import { Appbar, useTheme } from "react-native-paper"
import { useThemeSwitch } from "../../context/themeContext"
import SettingsUnitCard from "../cards/settingsCard"
import { useEffect, useState } from "react"
import { DeviceType, getDeviceTypeAsync } from "expo-device";
import { NativeStackHeaderProps } from "@react-navigation/native-stack"
import { Platform } from 'react-native';
import FileUploadButton from "./fileUpdoader";
import { HomeScreenTopAppBar } from "../../screens/mobile/homeScreen";

const TopAppBar = ({...props}: NativeStackHeaderProps) => {

    const [devType, setDevType] = useState(DeviceType.PHONE)

    useEffect(() => {
      getDeviceTypeAsync().then((deviceType) => {
        setDevType(deviceType);
      });
    }, []);

    const { toggleNightMode } = useThemeSwitch()

    const theme = useTheme()

    const [settingsVisible, setSettingsVisible] = useState(false)

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

            <Appbar.Action icon="cog-outline" onPress={() => setSettingsVisible(true)} />

            <SettingsUnitCard visibility={[settingsVisible, setSettingsVisible]} />

        </Appbar.Header>
    )
}

export default TopAppBar;
