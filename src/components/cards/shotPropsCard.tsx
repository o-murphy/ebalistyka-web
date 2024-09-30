import React, { useEffect, useRef, useState } from "react";
import CustomCard from "./customCard";
import { TrajectoryRangeField } from "../widgets/measureFields/trajectoryRangeField";
import { TrajectoryStepField } from "../widgets/measureFields/trajectoryCalcStep";
import { CalculationState, useProfile } from "../../context/profileContext";
import { View } from "react-native";
import { Text } from "react-native-paper";
import RecalculateChip from "../widgets/recalculateChip";
import { ProfileProps } from "../../utils/parseA7P";
import { CurrentConditionsProps } from "../../utils/ballisticsCalculator";


interface ShotParamsCardProps {
    label?: string;
    expanded?: boolean;
}

const ShotParamsCard: React.FC<ShotParamsCardProps> = ({ label = "Shot properties", expanded = true }) => {

    const { calcState, currentConditions } = useProfile()
    const [refreshable, setRefreshable] = useState(false)

    const prevCurrentConditionsRef = useRef<CurrentConditionsProps | null>(null);

    useEffect(() => {

        if ([CalculationState.ConditionsUpdated].includes(calcState)) {
            const rangeUpd = prevCurrentConditionsRef.current?.trajectoryRange !== currentConditions.trajectoryRange;
            const stepUpd = prevCurrentConditionsRef.current?.trajectoryStep !== currentConditions.trajectoryStep;
    
            if (rangeUpd || stepUpd) {
                setRefreshable(true)
            } else {
                setRefreshable(false)
            }
    
        } else {
            setRefreshable(false)
        }

        // Update the ref with the current profileProperties
        prevCurrentConditionsRef.current = currentConditions;
    }, [currentConditions, calcState]);

    return (
        <CustomCard 
            title={label} 
            expanded={expanded}
            iconButton={null}
        >
            <RecalculateChip visible={refreshable} style={{ marginHorizontal: 4 }} />
            <TrajectoryRangeField />
            <TrajectoryStepField />
        </CustomCard>
    );
};

export default ShotParamsCard;
