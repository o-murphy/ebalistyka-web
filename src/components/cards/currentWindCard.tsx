import React, { useEffect, useRef, useState } from "react";
import CustomCard from "./customCard";
import WindDirectionPicker from "../widgets/windDirectionPicker";
import { CalculationState, useCalculator } from "../../context/profileContext";
import { WindSpeedField } from "../widgets/measureFields";
import { View } from "react-native";
import { FAB, Icon, useTheme } from "react-native-paper";
import { Unit, UnitProps } from "js-ballistics/dist/v2";
import { RefreshFAB, RefreshFabState } from "../widgets/refreshFAB";

interface WindCardProps {
    label?: string;
    expanded?: boolean;
}

const CurrentWindCard: React.FC<WindCardProps> = ({ label = "Current wind", expanded = true }) => {
    const { currentConditions, updateCurrentConditions, calcState, fire } = useCalculator();
    const [windDir, setWindDir] = useState(currentConditions.windDirection);
    const [isHovered, setIsHovered] = useState(false);
    const [refreshable, setRefreshable] = useState(false);
    const initialWindDir = useRef(currentConditions.windDirection);
    const theme = useTheme();

    useEffect(() => {
        if (currentConditions.windDirection !== initialWindDir.current) {
            console.log("Setting wind direction from current conditions:", currentConditions.windDirection);
            setWindDir(currentConditions.windDirection);
            initialWindDir.current = currentConditions.windDirection;
        }
    }, [currentConditions.windDirection]);

    useEffect(() => {
        if (calcState === CalculationState.Complete) {
            setRefreshable(false);
        }
    }, [calcState]);

    const handleWindDirChange = (value) => {
        if (value !== windDir) {
            setWindDir(value);
        }
    };

    const handleMouseUp = () => {
        // Update current conditions when mouse button is released
        updateCurrentConditions({ windDirection: windDir });
        setRefreshable(true);
        console.log("Updated wind direction on mouse up:", windDir);
    };

    return (
        <CustomCard title={label} expanded={expanded}>
            <WindSpeedField />
            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                {(!isHovered && refreshable) && (
                    <RefreshFAB
                        state={refreshable ? RefreshFabState.Updated : RefreshFabState.Actual}
                        style={{ marginRight: 4 }}
                    />
                )}
                <View
                    // onMouseEnter={() => setIsHovered(true)}
                    // onMouseLeave={() => setIsHovered(false)}
                    onMouseDown={() => setIsHovered(true)}
                    onMouseUp={() => { handleMouseUp(); setIsHovered(false) }}
                >
                    {!isHovered ? (
                        <FAB
                            icon={() => (
                                <View style={{ transform: [{ rotate: `${180 + windDir * 30}deg` }] }}>
                                    <Icon size={28} source={"navigation-outline"} color={theme.colors.secondary} />
                                </View>
                            )}
                            size="small"
                            variant="surface"
                            label={`Wind from: ${windDir * 30}${UnitProps[Unit.Degree].symbol}`}
                            animated={false}
                        />
                    ) : (
                        <WindDirectionPicker
                            value={windDir}
                            onChange={handleWindDirChange}
                        />
                    )}
                </View>
            </View>
        </CustomCard>
    );
};

export default CurrentWindCard;