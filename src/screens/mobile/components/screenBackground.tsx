import { StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper/src/core/theming";
import { BOTTOM_APP_BAR_HEIGHT } from "./botAppBar";

const ScreenBackground = ({ children, style = null }) => {
    const theme = useTheme();

    return (
        <View style={[
            styles.container,
            { backgroundColor: theme.colors.surface },
            style
        ]}>
            {children}
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: BOTTOM_APP_BAR_HEIGHT,
    },
})


export default ScreenBackground;