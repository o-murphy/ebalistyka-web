import React, { useMemo } from "react";
import CustomCard from "./customCard";
import { useCalculator } from "../../context/profileContext";
import { TextInputChip } from "../widgets/inputChip";
import { ValueDialogChip } from "../../screens/desktop/components";

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
    const { cMuzzleVelocity, cZeroPTemperature } = useCalculator();

    if (!isLoaded) {
        return <CustomCard title={"Projectile"} expanded={expanded} />
    }
    return (
        <CustomCard title={"Projectile"} expanded={expanded}>
            <ProjectileName />
            <ValueDialogChip icon="speedometer" title="Muzzle velocity" dimension={cMuzzleVelocity}/>
            <ValueDialogChip icon="thermometer" title="Powder temperature" dimension={cZeroPTemperature}/>
            {/* <PowderSensField /> */}
        </CustomCard>
    );
};

export default ProjectileCard;
