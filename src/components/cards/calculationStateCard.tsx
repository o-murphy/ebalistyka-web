import { Text } from "react-native-paper";
import CustomCard from "./customCard";
import { useTheme } from "../../context/themeContext";
import { CalculationState, useCalculator } from "../../context/profileContext";
import { ColorValue, StyleSheet, View } from "react-native";
import { useEffect, useRef, useState } from "react";
import { ProfileProps } from "../../utils/parseA7P";
import { CurrentConditionsProps } from "../../utils/ballisticsCalculator";
import RecalculateChip from "../widgets/recalculateChip";

const CalculationStateCard = (cardStyle) => {
    const { theme } = useTheme();
    const {
        calcState, currentConditions,
        profileProperties, hitResult,
    } = useCalculator();

    const [, setRefreshable] = useState(false);

    const prevProfilePropertiesRef = useRef<ProfileProps | null>(null);
    const prevCurrentConditionsRef = useRef<CurrentConditionsProps>(currentConditions);

    useEffect(() => {
        if ([CalculationState.ConditionsUpdated, CalculationState.ZeroUpdated].includes(_calcState)) {
            const conChange = prevCurrentConditionsRef.current !== currentConditions;
            const profChange = prevProfilePropertiesRef.current !== profileProperties;

            setRefreshable(conChange || profChange);
        } else {
            setRefreshable(false);
        }

        prevProfilePropertiesRef.current = profileProperties;
        prevCurrentConditionsRef.current = currentConditions;
    }, [profileProperties, calcState]);

    let title: string;
    let details: string;
    let backgroundColor: ColorValue;
    let fontColor: ColorValue;
    let reloadAlert: boolean = false;
    let showButton: boolean = false;

    let _calcState = calcState;

    if (_calcState === CalculationState.NoData && profileProperties) {
        _calcState = CalculationState.ZeroUpdated;
    }

    switch (_calcState) {
        case CalculationState.Complete:
            title = "INFO";
            details = "Shot trajectory calculation success";
            backgroundColor = "#00AA8D";
            fontColor = theme.colors.surface;
            showButton = false;
            break;
        case CalculationState.ConditionsUpdated:
        case CalculationState.ZeroUpdated:
            title = "WARNING!";
            details = "Current conditions updated! Trajectory data not actual";
            backgroundColor = theme.colors.primaryContainer;
            fontColor = theme.colors.onPrimaryContainer;
            reloadAlert = true;
            showButton = true;
            break;
        case CalculationState.InvalidData:
            title = "WARNING!";
            details = "Enter valid values before calculation";
            backgroundColor = theme.colors.errorContainer;
            fontColor = theme.colors.error;
            break;
        case CalculationState.NoData:
            title = "WARNING! Zero data not initialized";
            details = "Open .a7p file to start calculation";
            backgroundColor = theme.colors.primaryContainer;
            fontColor = theme.colors.onPrimaryContainer;
            break;
        case CalculationState.Error:
            title = "ERROR!";
            details = hitResult instanceof Error ? hitResult?.message : "Undefined";
            backgroundColor = theme.colors.errorContainer;
            fontColor = theme.colors.error;
            reloadAlert = true;
            showButton = true;
            break;
    }

    return (
        <CustomCard
            style={{ ...cardStyle, backgroundColor: backgroundColor }}
            title={
                <View style={styles.row}>
                    <Text variant="bodyLarge" style={{ ...styles.column, color: fontColor }}>
                        {title}: {details}
                    </Text>
                    {showButton && ( // Conditionally render the chip
                        <RecalculateChip visible={showButton} />
                    )}
                </View>
            }
        >
        </CustomCard>
    );
}

const styles = StyleSheet.create({
    row: { 
        flexDirection: "row", 
        flexWrap: "wrap",  // Enable wrapping when there's not enough space
        justifyContent: "space-between", 
        alignItems: "center", 
        marginVertical: 4, 
        width: '100%' 
    },
    column: { flexDirection: "column", marginHorizontal: 4 },
    // chipContainer: { marginLeft: 'auto' } // Align the chip to the right
});

export default CalculationStateCard;
