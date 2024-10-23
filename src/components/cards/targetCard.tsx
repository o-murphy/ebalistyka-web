import React from "react";
import CustomCard from "./customCard";
import { TargetDistance, TargetLookAngleField } from "../widgets/measureFields";


interface TargetCardProps {
    label?: string;
    expanded?: boolean;
}

const TargetCard: React.FC<TargetCardProps> = ({ label = "Target", expanded = true }) => {

    console.log("render target card")

    return (
        <CustomCard 
            title={label} 
            expanded={expanded}
            iconButton={null}
        >
            <TargetDistance />
            <TargetLookAngleField />
        </CustomCard>
    );
};

export default TargetCard;
