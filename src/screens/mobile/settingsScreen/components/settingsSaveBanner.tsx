import { Banner, Text, useTheme } from "react-native-paper";


const SettingsSaveBanner = ({visible, onSubmit, onDismiss}) => {
    const theme = useTheme();

    return (
        <Banner
            visible={visible}
            style={{ backgroundColor: theme.colors.secondaryContainer }}
            actions={[
                { label: "Save".toUpperCase(), onPress: onSubmit, textColor: theme.colors.onSecondaryContainer },
                { label: "Discard".toUpperCase(), onPress: onDismiss, textColor: theme.colors.tertiary },
            ]}
            icon="content-save"
        >
            <Text>{"Changes detected in settings. Save changes?"}</Text>
        </Banner>
    )
}


export default SettingsSaveBanner;