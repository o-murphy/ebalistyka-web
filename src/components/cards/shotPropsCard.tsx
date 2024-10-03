import React from "react";
import CustomCard from "./customCard";
import { TrajectoryRangeField, TrajectoryStepField, TrajectoryTargetDistance } from "../widgets/measureFields";


interface ShotParamsCardProps {
    label?: string;
    expanded?: boolean;
}

const ShotParamsCard: React.FC<ShotParamsCardProps> = ({ label = "Shot properties", expanded = true }) => {

    return (
        <CustomCard 
            title={label} 
            expanded={expanded}
            iconButton={null}
        >
            
            <TrajectoryRangeField />
            <TrajectoryStepField />
            <TrajectoryTargetDistance />
        </CustomCard>
    );
};

export default ShotParamsCard;
