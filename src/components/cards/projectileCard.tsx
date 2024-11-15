import React, { useMemo } from "react";
import CustomCard from "./customCard";
import { useProfile } from "../../context";
import { TextInputChip } from "../widgets";
import { Divider } from "react-native-paper";
import { DimensionDialogChip, NumericDialogChip } from "../widgets";


interface ProjectileCardProps {
    title?: string;
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

const ProjectileCard: React.FC<ProjectileCardProps> = ({title = "Projectile"}) => {
    const { isLoaded } = useProfile()
    const { cMuzzleVelocity, cZeroTemperature: cZeroPTemperature, cTCoeff } = useProfile();

    if (!isLoaded) {
        return <CustomCard title={title} />
    }

    return (
        <CustomCard title={title} >
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
