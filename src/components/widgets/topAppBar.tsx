import { Appbar } from "react-native-paper"
import A7PFileUploader from "./fileDrop"
import { useTheme } from "../../context/themeContext"
import SettingsUnitCard from "../cards/settingsCard"
import { useState } from "react"
import { isMobile } from "react-device-detect"

const TopAppBar = () => {

    const { theme, toggleNightMode } = useTheme()
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
            <A7PFileUploader />
            <Appbar.Action icon="cog-outline" onPress={() => setSettingsVisible(true)} />

            <SettingsUnitCard visibility={[settingsVisible, setSettingsVisible]} />

        </Appbar.Header>
    )
}

export default TopAppBar;
