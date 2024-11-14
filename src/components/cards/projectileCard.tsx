import React, { useMemo } from "react";
import CustomCard from "./customCard";
import { useProfile } from "../../context/profileContext";
import { TextInputChip } from "../widgets/inputChip";
import { DimensionDialogChip, NumericDialogChip } from "../../screens/desktop/components";
import { Divider } from "react-native-paper";
import { min, range } from "lodash";

interface ProjectileCardProps {
    expanded?: boolean;
}

const ProjectileName = () => {
    const { profileProperties, updateProfileProperties } = useProfile();
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
    const { isLoaded } = useProfile()
    const { cMuzzleVelocity, cZeroTemperature: cZeroPTemperature, cTCoeff } = useProfile();

    if (!isLoaded) {
        return <CustomCard title={"Projectile"} expanded={expanded} />
    }
    return (
        <CustomCard title={"Projectile"} expanded={expanded}>
            <ProjectileName />
            <DimensionDialogChip icon="speedometer" title="Muzzle velocity" dimension={cMuzzleVelocity}/>
            <Divider />
            <DimensionDialogChip icon="thermometer" title="Powder temperature" dimension={cZeroPTemperature}/>
            <Divider />
            <NumericDialogChip icon="percent" title="Powder sensitivity" numeral={cTCoeff}/>
        </CustomCard>
    );
};

export default ProjectileCard;
