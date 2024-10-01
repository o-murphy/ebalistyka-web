import { Button, Switch, Text } from "react-native-paper"
import CustomCard from "./customCard";
import { useTheme } from "../../context/themeContext";
import { CalculationState, useProfile } from "../../context/profileContext";
import { ColorValue, StyleSheet, View } from "react-native";
import { useEffect, useRef, useState } from "react";
import { ProfileProps } from "../../utils/parseA7P";
import { CurrentConditionsProps } from "../../utils/ballisticsCalculator";
import RecalculateChip from "../widgets/recalculateChip";


const CalculationStateCard = (cardStyle) => {

    const { theme } = useTheme();
    const {
        calcState, currentConditions,
        profileProperties, hitResult
    } = useProfile();

    const [refreshable, setRefreshable] = useState(false)

    const prevProfilePropertiesRef = useRef<ProfileProps | null>(null);
    const prevCurrentConditionsRef = useRef<CurrentConditionsProps>(currentConditions);

    useEffect(() => {

        if ([CalculationState.ConditionsUpdated, CalculationState.ZeroUpdated].includes(_calcState)) {

            const conChange = prevCurrentConditionsRef.current != currentConditions;
            const profChange = prevProfilePropertiesRef.current != profileProperties;
    
            if (conChange || profChange) {
                setRefreshable(true)
            } else {
                setRefreshable(false)
            }
    
        } else {
            setRefreshable(false)
        }

        // Update the ref with the current profileProperties
        prevProfilePropertiesRef.current = profileProperties;
        prevCurrentConditionsRef.current = currentConditions;
    }, [profileProperties, calcState]);

    let title: string;
    let details: string;
    let backgroundColor: ColorValue;
    let fontColor: ColorValue;
    let reloadAlert: boolean = false;
    let showButton: boolean = false;

        let _calcState = calcState

        if (_calcState === CalculationState.NoData && profileProperties) {
            _calcState = CalculationState.ZeroUpdated;
        }

        switch (_calcState) {
            case CalculationState.Complete:
                title = "INFO"
                details = "Shot trajectory calculation success"
                backgroundColor = "#00AA8D"
                fontColor = theme.colors.onPrimary
                showButton = false
                break;
            case CalculationState.ConditionsUpdated:
                title = "WARNING!"
                details = "Current conditions updated! Trajectory data not actual"
                backgroundColor = theme.colors.primaryContainer
                fontColor = theme.colors.onPrimaryContainer
                reloadAlert = true
                showButton = true
                break;
            case CalculationState.ZeroUpdated:
                title = "WARNING!"
                details = "Zero data updated! Trajectory data not actual"
                backgroundColor = theme.colors.primaryContainer
                fontColor = theme.colors.onPrimaryContainer
                reloadAlert = true
                showButton = true
                break;
            case CalculationState.NoData:
                title = "WARNING! Zero data not initialized"
                details = "Open .a7p file to start calculations"
                backgroundColor = theme.colors.primaryContainer
                fontColor = theme.colors.onPrimaryContainer
                break;
            case CalculationState.Error:
                title = "ERROR!"
                details = hitResult instanceof Error ? hitResult?.message : "Undefined"
                backgroundColor = theme.colors.errorContainer
                fontColor = theme.colors.error
                reloadAlert = true
                showButton = true
                break;
        }
    // } else {
    //     switch (calcState) {
    //         case CalculationState.NoData:
    //             title = "WARNING! Zero data not initialized"
    //             details = "Open .a7p file to start calculations"
    //             backgroundColor = theme.colors.primaryContainer
    //             fontColor = theme.colors.onPrimaryContainer
    //             break;
    //         case CalculationState.Error:
    //             title = "ERROR!"
    //             details = hitResult instanceof Error ? hitResult?.message : "Undefined"
    //             backgroundColor = theme.colors.errorContainer
    //             fontColor = theme.colors.error
    //             reloadAlert = true
    //             break;
    //         default:
    //             title = "INFO"
    //             details = "Shot trajectory calculation success"
    //             backgroundColor = "#00AA8D"
    //             fontColor = theme.colors.onPrimary
    //             break;
    //     }
    // }

    return (
        <CustomCard
            style={{ ...cardStyle, backgroundColor: backgroundColor }}
            title={
                <View style={styles.row}>

                    <Text variant="bodyLarge" style={{ ...styles.column, color: fontColor }}>
                        {title}: {details}
                    </Text>
                    <RecalculateChip visible={showButton} style={{  }} />

                    {/* {showButton && <Button mode="contained" icon={"reload"} style={{
                        ...styles.column,
                        backgroundColor: theme.colors.onPrimaryContainer,
                    }} textColor={theme.colors.primaryContainer} onPress={fire} >Refresh</Button>} */}
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