import React from "react";
import { Appbar } from "react-native-paper";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { TopAppBar } from "../components";


// Top AppBar component
const SettingsScreenTopAppBar = ({ ...props }: NativeStackHeaderProps) => {
    const { back, navigation } = props;

    return (
        <TopAppBar>
            <Appbar.BackAction onPress={() => navigation.navigate(back.title)} />
            <Appbar.Content title="Shot info" />
        </TopAppBar>
    );
};


export default SettingsScreenTopAppBar;