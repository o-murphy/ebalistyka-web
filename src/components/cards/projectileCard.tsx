import { TextInput } from "react-native-paper";
import React, { useCallback, useEffect, useState } from "react";
import CustomCard from "./customCard";
import SimpleDialog from "../dialogs/simpleDialog";
import MeasureFormField, { styles as measureFormFieldStyles } from "../widgets/measureField";
import { useProfile } from "../../context/profileContext";
import debounce from "../../utils/debounce";
import { measureFieldsProps } from "../widgets/measureFieldsProperties";
import { Measure, preferredUnits, Unit, UNew, UnitProps } from "js-ballistics/dist/v2";

interface ProjectileCardProps {
    expanded?: boolean;
}

const ProjectileCard: React.FC<ProjectileCardProps> = ({ expanded = true }) => {

    const { profileProperties, updateProfileProperties } = useProfile();
    const [curName, setCurName] = useState<string>("My Cartridge");

    const debouncedUpdateProfileProperties = useCallback(debounce(updateProfileProperties, 350), [updateProfileProperties]);

    useEffect(() => {
        if (profileProperties) {
            setCurName(profileProperties.profileName);
        }
    }, [profileProperties]);

    const acceptName = (): void => debouncedUpdateProfileProperties({ cartridgeName: curName });
    const declineName = (): void => setCurName(profileProperties?.cartridgeName);

    if (!profileProperties) {
        return (
            <CustomCard title={"Projectile"} expanded={expanded}>
                {/* <ActivityIndicator animating={true} /> */}
            </CustomCard>
        )
    }

    return (
        <CustomCard title={"Projectile"} expanded={expanded}>
            <SimpleDialog
                style={measureFormFieldStyles.nameContainer}
                label={"Projectile name"}
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
                suffix={UnitProps[preferredUnits.velocity].symbol}
                value={profileProperties ? UNew.MPS(profileProperties.cMuzzleVelocity / 10).In(preferredUnits.velocity) : 0}
                onValueChange={value => debouncedUpdateProfileProperties({ cMuzzleVelocity: Math.round(new Measure.Velocity(value, preferredUnits.velocity).In(Unit.MPS) * 10) })}
            />

            <MeasureFormField
                {...measureFieldsProps.powderSens}
                value={profileProperties ? profileProperties.cTCoeff / 1000 : 0}
                onValueChange={value => debouncedUpdateProfileProperties({ cTCoeff: Math.round(value * 1000) })}
            />

        </CustomCard>
    );
};

export default ProjectileCard;
