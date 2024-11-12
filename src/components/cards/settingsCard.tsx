
import { Dialog, IconButton, Portal, Text } from "react-native-paper"
import { StyleSheet, View } from "react-native";
import { SettingsContent } from "../../screens/mobile/settingsScreen";


export default function SettingsUnitCard({ visibility }) {

    const [visible, setVisible] = visibility

    const onDismiss = () => {
        setVisible(false)
    }

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
                <Dialog.Title>
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                        <View style={{justifyContent: "center"}}>
                            <Text>{"Settings"}</Text>
                        </View>
                        <IconButton icon={"close"} onPress={onDismiss} />
                    </View>
                </Dialog.Title>
                <SettingsContent />
            </Dialog>
        </Portal>
    )
}

const styles = StyleSheet.create({
    dialog: {
        width: 400,
        height: "80%",
        alignSelf: 'center',
        justifyContent: 'center'
    },
});
