import { ScrollView, StyleSheet } from "react-native";
import { useTheme } from "../../context/themeContext";
import { Appbar, Divider, List } from "react-native-paper";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";


export const ConvertorTopAppBar = ({...props}: NativeStackHeaderProps) => {
    
    const { back, navigation } = props;

    const { theme } = useTheme()
    // const [settingsVisible, setSettingsVisible] = useState(false)

    

    return (
        <Appbar.Header mode={"center-aligned"} style={{
            height: 48,
            backgroundColor: theme.colors.elevation.level2
        }}>
            <Appbar.BackAction onPress={() => navigation.navigate(back.title)}/>
            <Appbar.Content title="Convertors"/>
            {/* <Appbar.Action icon="cog-outline" onPress={() => setSettingsVisible(true)} /> */}

            {/* <SettingsUnitCard visibility={[settingsVisible, setSettingsVisible]} /> */}

        </Appbar.Header>
    )
}

export const ConvertorScreen = ({ navigation }) => {
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
            <List.Section>
                <List.Item title="Distance" left={props => <List.Icon {...props} icon="map-marker-distance" />} onPress={() => console.log("d conv")} />
                <Divider />
                <List.Item title="Velocity" left={props => <List.Icon {...props} icon="speedometer" />} onPress={() => console.log("v conv")} />
                <Divider />
                <List.Item title="Length" left={props => <List.Icon {...props} icon="arrow-expand-horizontal" />} onPress={() => console.log("l conv")} />
                <Divider />
                <List.Item title="Weight" left={props => <List.Icon {...props} icon="weight" />} onPress={() => console.log("w conv")} />
                <Divider />
                <List.Item title="Pressure" left={props => <List.Icon {...props} icon="speedometer" />} onPress={() => console.log("p conv")} />
                <Divider />
                <List.Item title="Temperature" left={props => <List.Icon {...props} icon="thermometer" />} onPress={() => console.log("t conv")} />
                <Divider />
                <List.Item title="Angular" left={props => <List.Icon {...props} icon="angle-acute" />} onPress={() => console.log("a conv")} />
            </List.Section>

        </ScrollView>
    )
}