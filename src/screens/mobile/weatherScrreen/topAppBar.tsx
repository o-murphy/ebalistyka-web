import { Appbar } from "react-native-paper";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { TopAppBar } from "../components";


const WeatherTopAppBar = ({ ...props }: NativeStackHeaderProps) => {
    const { back, navigation } = props;
    return (
        <TopAppBar>
            <Appbar.BackAction onPress={() => navigation.navigate(back.title)} />
            <Appbar.Content title="Shooting conditions" />
            <Appbar.Action icon="cog-outline" onPress={() => navigation.navigate("SettingsScreen")} />
        </TopAppBar>
    )
}


export default WeatherTopAppBar;