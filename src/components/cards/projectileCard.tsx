import React, { useEffect, useRef, useState } from "react";
import CustomCard from "./customCard";
import { CalculationState, useProfile } from "../../context/profileContext";
import { MuzzleVelocityField, PowderSensField } from "../widgets/measureFields";
import { ProfileProps } from "../../utils/parseA7P";
import RecalculateChip from "../widgets/recalculateChip";
import { TextInputChip } from "../widgets/inputChip";

interface ProjectileCardProps {
    expanded?: boolean;
}

const ProjectileCard: React.FC<ProjectileCardProps> = ({ expanded = true }) => {

    const { profileProperties, updateProfileProperties, calcState } = useProfile();

    const [refreshable, setRefreshable] = useState(false)

    const prevProfilePropertiesRef = useRef<ProfileProps | null>(null);

    useEffect(() => {
        
        if ([CalculationState.ZeroUpdated].includes(calcState)) {
            const mv = prevProfilePropertiesRef.current?.cMuzzleVelocity !== profileProperties.cMuzzleVelocity;
            const sens = prevProfilePropertiesRef.current?.cTCoeff !== profileProperties.cTCoeff;
    
            if (mv || sens) {
                setRefreshable(true)
            } else {
                setRefreshable(false)
            }
    
        } else {
            setRefreshable(false)
        }

        // Update the ref with the current profileProperties
        prevProfilePropertiesRef.current = profileProperties;
    }, [profileProperties, calcState]);

    if (!profileProperties) {
        return (
            <CustomCard title={"Projectile"} expanded={expanded} />
        )
    }

    return (
        <CustomCard title={"Projectile"} expanded={expanded}>
            <RecalculateChip visible={refreshable} style={{ marginVertical: 8 }} />

            <TextInputChip 
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
