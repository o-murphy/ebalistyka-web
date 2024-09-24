import { Appbar } from "react-native-paper"
import A7PFileUploader from "./fileDrop"
import { useTheme } from "../../context/themeContext"


const TopAppBar = () => {

    const { theme, toggleNightMode } = useTheme()

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
            <Appbar.Action icon="cog-outline" onPress={() => { }} />

        </Appbar.Header>
    )
}

export default TopAppBar;
