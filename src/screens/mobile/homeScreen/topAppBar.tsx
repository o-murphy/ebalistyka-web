import { Appbar, useTheme } from "react-native-paper";
import FileUploadButton from "../../../components/widgets/fileUpdoader";
import { useThemeSwitch } from "../../../context/themeContext";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";

const HomeScreenTopAppBar = ({ navigation }: NativeStackHeaderProps) => {
    const theme = useTheme();
    const { toggleNightMode } = useThemeSwitch();

    // Іконка для режиму дня/ночі залежно від теми
    const nightModeIcon = theme.dark ? "brightness-7" : "brightness-3";

    return (
        <Appbar.Header
            mode="center-aligned"
            style={{
                height: 48,
                backgroundColor: theme.colors.elevation.level2,
            }}
        >
            <Appbar.Action icon={nightModeIcon} onPress={toggleNightMode} />
            <Appbar.Content title="E-Balistyka" />
            <FileUploadButton />
            <Appbar.Action icon="cog-outline" onPress={() => navigation.navigate("SettingsScreen")} />
        </Appbar.Header>
    );
};

export default HomeScreenTopAppBar;
