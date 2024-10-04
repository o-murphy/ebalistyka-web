import React from "react";
import CustomCard from "./customCard";
import { TrajectoryRangeField, TrajectoryStepField } from "../widgets/measureFields";


interface TrajectoryCardProps {
    label?: string;
    expanded?: boolean;
}

const TrajectoryParamsCard: React.FC<TrajectoryCardProps> = ({ label = "Shot properties", expanded = true }) => {

    return (
        <CustomCard 
            title={label} 
            expanded={expanded}
            iconButton={null}
        >
            
            <TrajectoryRangeField />
            <TrajectoryStepField />
        </CustomCard>
    );
};

export default TrajectoryParamsCard;
