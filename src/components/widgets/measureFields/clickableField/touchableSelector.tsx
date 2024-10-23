import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import Icon, { IconSource } from "react-native-paper/src/components/Icon";
import { useTheme } from "../../../../context/themeContext";
import { useState } from "react";


interface TouchableTileProps {
    style?: StyleProp<ViewStyle>;
    icon?: IconSource;
    onPress?: () => void;
}

const TouchableIcon: React.FC<TouchableTileProps> = ({
    style = null,
    icon = null,
    onPress = null,
}) => {
    const { theme } = useTheme()
    const [dynamicIconSize, setDynamicIconSize] = useState(null);

    const handleLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        setDynamicIconSize(height); // Store the view's height
    };

    return (
        <TouchableOpacity
            style={[styles.center, style]}
            onPress={() => { onPress?.() }}
            onLayout={handleLayout}
        >
            <Icon size={dynamicIconSize} color={theme.colors.primary} source={icon} />
        </TouchableOpacity>
    )
}

const TouchableValueSelector = ({ children, onUp, onDown }) => {
    const { theme } = useTheme();

    const _styles = {
        container: [styles.column, styles.selector, { backgroundColor: theme.colors.surfaceVariant }],
    };

    return (
        <View style={_styles.container} >
            <TouchableIcon icon={"arrow-up"} onPress={onUp} />
            {children}
            <TouchableIcon icon={"arrow-down"} onPress={onDown} />
        </View>
    );
};

const styles = StyleSheet.create({
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    row: {
        flexDirection: "row",
        marginVertical: 4,
        width: "100%",
    },
    column: {
        flexDirection: "column",
        marginHorizontal: 4,
        height: "100%"
    },
    selector: {
        flex: 1,
        aspectRatio: 1,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        backgroundColor: "transparent",
        overflow: "hidden",
    },
})

export { TouchableValueSelector, TouchableIcon as TouchableTile, TouchableTileProps };