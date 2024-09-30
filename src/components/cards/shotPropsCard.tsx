import React from "react";
import CustomCard from "./customCard";
import { TrajectoryRangeField } from "../widgets/measureFields/trajectoryRangeField";
import { TrajectoryStepField } from "../widgets/measureFields/trajectoryCalcStep";


interface ShotParamsCardProps {
    label?: string;
    expanded?: boolean;
}

const ShotParamsCard: React.FC<ShotParamsCardProps> = ({ label = "Shot properties", expanded = true }) => {
    
    return (
        <CustomCard title={label} expanded={expanded}>
            <TrajectoryRangeField />
            <TrajectoryStepField />
        </CustomCard>
    );
};

export default ShotParamsCard;
