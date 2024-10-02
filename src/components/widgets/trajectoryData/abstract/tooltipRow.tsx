import { View } from "react-native"
import { Text } from "react-native-paper"


export const ToolTipRow = ({ label, value }) => {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ marginRight: 8 }}>{label}</Text>
            <Text style={{ textAlign: "right" }}>{value}</Text>
        </View>
    )
}