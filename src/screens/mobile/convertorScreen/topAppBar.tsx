import { Appbar } from "react-native-paper";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { TopAppBar } from "../components";


const ConvertorTopAppBar = ({ ...props }: NativeStackHeaderProps) => {
    const { back, navigation } = props;
    return (
        <TopAppBar>
            <Appbar.BackAction onPress={() => navigation.navigate(back.title)} />
            <Appbar.Content title="Convertor" />
        </TopAppBar>
    )
}


export default ConvertorTopAppBar;