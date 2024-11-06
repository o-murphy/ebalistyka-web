import { Appbar, useTheme } from "react-native-paper";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";



const TablesTopAppBar = ({ ...props }: NativeStackHeaderProps) => {

    const { back, navigation } = props;
    const theme = useTheme()

    return (
        <Appbar.Header mode={"center-aligned"} style={{
            height: 48,
            backgroundColor: theme.colors.elevation.level2
        }}>
            <Appbar.BackAction onPress={() => navigation.navigate(back.title)} />
            <Appbar.Content title="Tables" />
            <Appbar.Action icon="cog-outline" onPress={() => navigation.navigate("SettingsScreen")} />
        </Appbar.Header>
    )
}


export default TablesTopAppBar;