import { ActivityIndicator, TextInput } from "react-native-paper";
import React, { useContext, useEffect, useState } from "react";
import InputCard from "./inputCard";
import SimpleDialog from "../dialogs/simpleDialog";
import { Unit, UnitProps } from "js-ballistics/dist/v2";
import MeasureFormField, { MeasureFormFieldProps, styles as measureFormFieldStyles } from "../widgets/measureField";
import { ProfileContext } from "../../providers/profileLoaderProvider";

interface ProjectileCardProps {
    expanded?: boolean;
}

const ProjectileCard: React.FC<ProjectileCardProps> = ({ expanded = true }) => {

    const { fileContent, updateProfileProperties } = useContext(ProfileContext);
    const [curName, setCurName] = useState<string>("My Cartridge");

    useEffect(() => {
        if (fileContent) {
            setCurName(fileContent.profileName);
        }
    }, [fileContent]);

    const acceptName = (): void => updateProfileProperties({ cartridgeName: curName });
    const declineName = (): void => setCurName(fileContent?.cartridgeName);

    if (!fileContent) {
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
                text={fileContent?.cartridgeName}
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
                value={fileContent ? fileContent.cMuzzleVelocity / 10 : 0}
                onValueChange={value => updateProfileProperties({ cMuzzleVelocity: Math.round(value * 10) })}
            />

            <MeasureFormField
                {...fields.powderSens}
                value={fileContent ? fileContent.cTCoeff / 1000 : 0}
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
        decimals: 0,
    },
    powderSens: {
        key: "cTCoeff",
        label: "Temperature sens.",
        suffix: "/15°C",
        icon: "percent",
        value: 0,
        maxValue: 5,
        minValue: 0,
        decimals: 2,
    }
}

export default ProjectileCard;
