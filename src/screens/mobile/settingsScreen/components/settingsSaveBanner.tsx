import { Banner, Text, useTheme } from "react-native-paper";


const SettingsSaveBanner = ({visible, onSubmit, onDismiss, error = null}) => {
    const theme = useTheme();

    const text = error ? "Wrong settings" : "Changes detected in settings. Save changes?"

    const color = error ? theme.colors.errorContainer : theme.colors.secondaryContainer

    return (
        <Banner
            visible={visible}
            style={{ backgroundColor: color }}
            actions={[
                !error && { label: "Save".toUpperCase(), onPress: onSubmit, textColor: theme.colors.onSecondaryContainer },
                { label: "Discard".toUpperCase(), onPress: onDismiss, textColor: theme.colors.tertiary },
            ]}
            icon="content-save"
        >
            <Text>{text}</Text>
        </Banner>
    )
}


export default SettingsSaveBanner;