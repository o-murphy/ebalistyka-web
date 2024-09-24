import { TextInput } from "react-native-paper";
import React, { useCallback, useEffect, useState } from "react";
import InputCard from "./inputCard";
import SimpleDialog from "../dialogs/simpleDialog";
import MeasureFormField, { styles as measureFormFieldStyles } from "../widgets/measureField";
import { useProfile } from "../../context/profileContext";
import debounce from "../../utils/debounce";
import { measureFieldsProps } from "../widgets/measureFieldsProperties";

interface ProjectileCardProps {
    expanded?: boolean;
}

const ProjectileCard: React.FC<ProjectileCardProps> = ({ expanded = true }) => {

    const { profileProperties, updateProfileProperties } = useProfile();
    const [curName, setCurName] = useState<string>("My Cartridge");

    const debouncedUpdateProfileProperties = useCallback(debounce(updateProfileProperties, 300), [updateProfileProperties]);

    useEffect(() => {
        if (profileProperties) {
            setCurName(profileProperties.profileName);
        }
    }, [profileProperties]);

    const acceptName = (): void => debouncedUpdateProfileProperties({ cartridgeName: curName });
    const declineName = (): void => setCurName(profileProperties?.cartridgeName);

    if (!profileProperties) {
        return (
            <InputCard title={"Projectile"} expanded={expanded}>
                {/* <ActivityIndicator animating={true} /> */}
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
                {...measureFieldsProps.muzzleVelocity}
                value={profileProperties ? profileProperties.cMuzzleVelocity / 10 : 0}
                onValueChange={value => debouncedUpdateProfileProperties({ cMuzzleVelocity: Math.round(value * 10) })}
            />

            <MeasureFormField
                {...measureFieldsProps.powderSens}
                value={profileProperties ? profileProperties.cTCoeff / 1000 : 0}
                onValueChange={value => debouncedUpdateProfileProperties({ cTCoeff: Math.round(value * 1000) })}
            />

        </InputCard>
    );
};

export default ProjectileCard;
