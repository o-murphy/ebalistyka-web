import { Appbar } from "react-native-paper";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { TopAppBar } from "../components";


const ShotInfoTopAppBar = ({ ...props }: NativeStackHeaderProps) => {

    const { back, navigation } = props;

    return (
        <TopAppBar>
            <Appbar.BackAction onPress={() => navigation.navigate(back.title)} />
            <Appbar.Content title="Shot info" />
        </TopAppBar>
    )
}


export default ShotInfoTopAppBar;