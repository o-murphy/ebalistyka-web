import { ScrollView, StyleSheet } from "react-native";
import { useTheme } from "../../context/themeContext";
import { Appbar, Divider, List } from "react-native-paper";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";


export const ShotInfoTopAppBar = ({...props}: NativeStackHeaderProps) => {
    
    const { back, navigation } = props;
    const { theme } = useTheme()   

    return (
        <Appbar.Header mode={"center-aligned"} style={{
            height: 48,
            backgroundColor: theme.colors.elevation.level2
        }}>
            <Appbar.BackAction onPress={() => navigation.navigate(back.title)}/>
            <Appbar.Content title="Info"/>
        </Appbar.Header>
    )
}

export const ShotInfoScreen = ({ navigation }) => {
    const { theme } = useTheme();

    const styles = StyleSheet.create({
        scrollViewContainer: {
            backgroundColor: theme.colors.background,
        },
    });

    return (
        <ScrollView
            style={styles.scrollViewContainer}
            keyboardShouldPersistTaps="always"
            alwaysBounceVertical={false}
            showsVerticalScrollIndicator={true}

            contentContainerStyle={{
                // height: "60%", maxHeight: 420, 
                padding: 8,
                paddingBottom: 16,
                backgroundColor: theme.colors.elevation.level1,
                borderBottomRightRadius: 32, borderBottomLeftRadius: 32,
            }}
        >


        </ScrollView>
    )
}