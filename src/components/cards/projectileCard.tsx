import React, { useMemo } from "react";
import CustomCard from "./customCard";
import { CalculationState, useCalculator } from "../../context/profileContext";
import { MuzzleVelocityField, PowderSensField } from "../widgets/measureFields";
import { TextInputChip } from "../widgets/inputChip";

interface ProjectileCardProps {
    expanded?: boolean;
}

const ProjectileName = () => {
    const { profileProperties, updateProfileProperties } = useCalculator();
    const text = useMemo(() => profileProperties?.cartridgeName, [profileProperties?.cartridgeName])
    return (
        <TextInputChip
            style={{ marginVertical: 4 }}
            icon={"card-bulleted-outline"}
            label={"Projectile name"}
            text={text ?? "My projectile"}
            onTextChange={text => updateProfileProperties({ cartridgeName: text })}
        />
    )
}

const ProjectileCard: React.FC<ProjectileCardProps> = ({ expanded = true }) => {
    const { isLoaded } = useCalculator()

    if (!isLoaded) {
        return <CustomCard title={"Weapon"} expanded={expanded} />
    }
    return (
        <CustomCard title={"Projectile"} expanded={expanded}>
            <ProjectileName />
            <MuzzleVelocityField />
            <PowderSensField />
        </CustomCard>
    );
};

export default ProjectileCard;
