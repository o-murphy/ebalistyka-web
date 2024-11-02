import { ScrollView, StyleSheet, View } from "react-native";
import { useTheme } from "../../context/themeContext";
import { Appbar, Button } from "react-native-paper";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import SettingsUnitCard from "../../components/cards/settingsCard";
import { ZeroTable } from "../../components/widgets/trajectoryData";
import { useCalculator } from "../../context/profileContext";
import { HitResult } from "js-ballistics/dist/v2";


export const TablesTopAppBar = ({...props}: NativeStackHeaderProps) => {
    
    const { back, navigation } = props;

    const { theme } = useTheme()
    const [settingsVisible, setSettingsVisible] = useState(false)

    

    return (
        <Appbar.Header mode={"center-aligned"} style={{
            height: 48,
            backgroundColor: theme.colors.elevation.level2
        }}>
            <Appbar.BackAction onPress={() => navigation.navigate(back.title)}/>
            <Appbar.Content title="Tables"/>
            <Appbar.Action icon="cog-outline" onPress={() => setSettingsVisible(true)} />

            <SettingsUnitCard visibility={[settingsVisible, setSettingsVisible]} />

        </Appbar.Header>
    )
}


export const TablesScreen = ({ navigation }) => {
    const { theme } = useTheme();
    const { hitResult } = useCalculator()

    const styles = StyleSheet.create({
        scrollViewContainer: {
            // flex: 1
            // backgroundColor: theme.colors.background,
            // marginBottom: 64,
            overflow: "hidden",
            borderBottomRightRadius: 32, borderBottomLeftRadius: 32,
            paddingBottom: 16
        },
    });
    
    return (
        <View style={{
            flex: 1,
            backgroundColor: theme.colors.background,
            marginBottom: 64,

        }}>
            <ScrollView
            style={styles.scrollViewContainer}
            keyboardShouldPersistTaps="always"
            alwaysBounceVertical={false}
            showsVerticalScrollIndicator={true}

            contentContainerStyle={{
                // height: "60%", maxHeight: 420, 
                flex: 1,
                padding: 8,
                paddingBottom: 16,
                // backgroundColor: theme.colors.elevation.level1,

            }}
        >
            {(hitResult instanceof HitResult) && <ZeroTable />}
        </ScrollView>
        <View style={{flexDirection: "row", alignItems: "center", padding: 16, justifyContent: "space-around"}}>
            <Button mode="elevated" style={{width: "40%"}}>Settings</Button>
            <Button mode="elevated" style={{width: "40%"}}>Export</Button>
        </View>
        </View>
    )
}