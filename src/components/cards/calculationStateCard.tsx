import { Button, Switch, Text } from "react-native-paper"
import CustomCard from "./customCard";
import { useTheme } from "../../context/themeContext";
import { useProfile } from "../../context/profileContext";
import { ColorValue, StyleSheet, View } from "react-native";


const CalculationStateCard = (cardStyle) => {

    const { theme } = useTheme();
    const {
        hitResult, calcState, setCalcState,
        autoRefresh,
        profileProperties, fire
    } = useProfile();

    let title: string;
    let details: string;
    let backgroundColor: ColorValue;
    let fontColor: ColorValue;
    let reloadAlert: boolean = false;
    let showButton: boolean = false;

    if (!autoRefresh) {
        if (calcState === 0 && profileProperties) {
            setCalcState(1)
        }

        switch (calcState) {
            case 3:
                title = "INFO"
                details = "Shot trajectory calculation success"
                backgroundColor = "#00AA8D"
                fontColor = theme.colors.onPrimary
                showButton = true
                break;
            case 2:
                title = "WARNING!"
                details = "Current conditions updated! Trajectory data not actual"
                backgroundColor = theme.colors.primaryContainer
                fontColor = theme.colors.onPrimaryContainer
                reloadAlert = true
                showButton = true
                break;
            case 1:
                title = "WARNING!"
                details = "Zero data updated! Trajectory data not actual"
                backgroundColor = theme.colors.primaryContainer
                fontColor = theme.colors.onPrimaryContainer
                reloadAlert = true
                showButton = true
                break;
            case 0:
                title = "WARNING! Zero data not initialized"
                details = "Open .a7p file to start calculations"
                backgroundColor = theme.colors.primaryContainer
                fontColor = theme.colors.onPrimaryContainer
                break;
            case -1:
                title = "ERROR!"
                details = hitResult instanceof Error ? hitResult?.message : "Undefined"
                backgroundColor = theme.colors.errorContainer
                fontColor = theme.colors.error
                reloadAlert = true
                showButton = true
                break;
        }
    } else {
        switch (calcState) {
            case 0:
                title = "WARNING! Zero data not initialized"
                details = "Open .a7p file to start calculations"
                backgroundColor = theme.colors.primaryContainer
                fontColor = theme.colors.onPrimaryContainer
                break;
            case -1:
                title = "ERROR!"
                details = hitResult instanceof Error ? hitResult?.message : "Undefined"
                backgroundColor = theme.colors.errorContainer
                fontColor = theme.colors.error
                reloadAlert = true
                break;
            default:
                title = "INFO"
                details = "Shot trajectory calculation success"
                backgroundColor = "#00AA8D"
                fontColor = theme.colors.onPrimary
                break;
        }
    }

    return (
        <CustomCard
            style={{ ...cardStyle, backgroundColor: backgroundColor }}
            title={
                <View style={styles.row}>

                    <Text variant="bodyLarge" style={{ ...styles.column, color: fontColor }}>
                        {title}: {details}
                    </Text>
                    {showButton && <Button mode="contained" icon={"reload"} style={{
                        ...styles.column,
                        backgroundColor: theme.colors.onPrimaryContainer,
                    }} textColor={theme.colors.primaryContainer} onPress={fire} >Refresh</Button>}
                </View>
            }>

        </CustomCard>
    )
}

const styles = StyleSheet.create({
    row: { flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center" },
    column: { flexDirection: "column", marginHorizontal: 4 }
})

export default CalculationStateCard