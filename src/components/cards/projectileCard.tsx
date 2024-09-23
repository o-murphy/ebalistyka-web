import { ActivityIndicator, TextInput } from "react-native-paper";
import React, { useContext, useEffect, useState } from "react";
import InputCard from "./inputCard";
import SimpleDialog from "../dialogs/simpleDialog";
import { Unit, UnitProps } from "js-ballistics/dist/v2";
import MeasureFormField, { MeasureFormFieldProps, styles as measureFormFieldStyles } from "../widgets/measureField";
import { ProfileContext } from "../../providers/profileProvider";

interface ProjectileCardProps {
    expanded?: boolean;
}

const ProjectileCard: React.FC<ProjectileCardProps> = ({ expanded = true }) => {

    const { profileProperties, updateProfileProperties } = useContext(ProfileContext);
    const [curName, setCurName] = useState<string>("My Cartridge");

    useEffect(() => {
        if (profileProperties) {
            setCurName(profileProperties.profileName);
        }
    }, [profileProperties]);

    const acceptName = (): void => updateProfileProperties({ cartridgeName: curName });
    const declineName = (): void => setCurName(profileProperties?.cartridgeName);

    if (!profileProperties) {
        return (
            <InputCard title={"Weapon"} expanded={expanded}>
                <ActivityIndicator animating={true} />
            </InputCard>                
        )
    }

    return (
        <InputCard title={"Projectile"} expanded={expanded}>
            <SimpleDialog
                style={measureFormFieldStyles.nameContainer}
                label={"Name"}
                icon={"card-bulleted-outline"}
                text={profileProperties?.cartridgeName}
                onAccept={acceptName}
                onDecline={declineName}
            >
                <TextInput
                    value={curName}
                    onChangeText={setCurName}
                />
            </SimpleDialog>

            <MeasureFormField
                {...fields.muzzleVelocity}
                value={profileProperties ? profileProperties.cMuzzleVelocity / 10 : 0}
                onValueChange={value => updateProfileProperties({ cMuzzleVelocity: Math.round(value * 10) })}
            />

            <MeasureFormField
                {...fields.powderSens}
                value={profileProperties ? profileProperties.cTCoeff / 1000 : 0}
                onValueChange={value => updateProfileProperties({ cTCoeff: Math.round(value * 1000) })}
            />

        </InputCard>
    );
};

const fields: Record<string, MeasureFormFieldProps> = {
    muzzleVelocity: {
        key: "cMuzzleVelocity",
        label: "Muzzle velocity",
        suffix: UnitProps[Unit.MPS].symbol,
        icon: "speedometer",
        value: 0,
        maxValue: 2000,
        minValue: 10,
        fractionDigits: 0,
    },
    powderSens: {
        key: "cTCoeff",
        label: "Temperature sens.",
        suffix: "/15°C",
        icon: "percent",
        value: 0,
        maxValue: 5,
        minValue: 0,
        fractionDigits: 2,
    }
}

export default ProjectileCard;
