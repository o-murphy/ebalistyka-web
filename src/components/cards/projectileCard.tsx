import React from "react";
import CustomCard from "./customCard";
import { useCalculator } from "../../context/profileContext";
import { MuzzleVelocityField, PowderSensField } from "../widgets/measureFields";
import { TextInputChip } from "../widgets/inputChip";

interface ProjectileCardProps {
    expanded?: boolean;
}

const ProjectileCard: React.FC<ProjectileCardProps> = ({ expanded = true }) => {

    const { profileProperties, updateProfileProperties } = useCalculator();

    if (!profileProperties) {
        return (
            <CustomCard title={"Projectile"} expanded={expanded} />
        )
    }

    return (
        <CustomCard title={"Projectile"} expanded={expanded}>

            <TextInputChip 
                style={{ marginVertical: 4 }}
                icon={"card-bulleted-outline"} 
                label={"Projectile name"}
                text={profileProperties?.cartridgeName ?? "My projectile"}
                onTextChange={text => updateProfileProperties({ cartridgeName: text })}
            />

            <MuzzleVelocityField />
            <PowderSensField />

        </CustomCard>
    );
};

export default ProjectileCard;
