import { Appbar, useTheme } from "react-native-paper"
import { useThemeSwitch } from "../../../context/themeContext"
import SettingsCard from "../../../components/cards/settingsCard"
import { useState } from "react"
import { NativeStackHeaderProps } from "@react-navigation/native-stack"
import { Platform } from 'react-native';
import FileUploadButton from "../../../components/widgets/fileUpdoadButton";


const TopAppBar = ({...props}: NativeStackHeaderProps) => {

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

            {/* <Appbar.Action icon="cog-outline" onPress={() => setSettingsVisible(true)} /> */}

            <SettingsCard visibility={[settingsVisible, setSettingsVisible]} />

        </Appbar.Header>
    )
}

export default TopAppBar;
