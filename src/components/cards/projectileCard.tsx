import { TextInput } from "react-native-paper";
import React, { useCallback, useEffect, useRef, useState } from "react";
import CustomCard from "./customCard";
import SimpleDialog from "../dialogs/simpleDialog";
import { styles as measureFormFieldStyles } from "../widgets/measureFields/measureField/measureField";
import { CalculationState, useProfile } from "../../context/profileContext";
import debounce from "../../utils/debounce";
import { MuzzleVelocityField, PowderSensField } from "../widgets/measureFields";
import { ProfileProps } from "../../utils/parseA7P";
import RecalculateChip from "../widgets/recalculateChip";

interface ProjectileCardProps {
    expanded?: boolean;
}

const ProjectileCard: React.FC<ProjectileCardProps> = ({ expanded = true }) => {

    const { profileProperties, updateProfileProperties, calcState, autoRefresh } = useProfile();
    const [curName, setCurName] = useState<string>("My Cartridge");

    const debouncedUpdateProfileProperties = useCallback(debounce(updateProfileProperties, 350), [updateProfileProperties]);

    const [refreshable, setRefreshable] = useState(false)

    const prevProfilePropertiesRef = useRef<ProfileProps | null>(null);

    useEffect(() => {
        
        if ([CalculationState.ZeroUpdated].includes(calcState) && !autoRefresh) {
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

    useEffect(() => {
        if (profileProperties) {
            setCurName(profileProperties.profileName);
        }
    }, [profileProperties]);

    const acceptName = (): void => debouncedUpdateProfileProperties({ cartridgeName: curName });
    const declineName = (): void => setCurName(profileProperties?.cartridgeName);

    if (!profileProperties) {
        return (
            <CustomCard title={"Projectile"} expanded={expanded} />
        )
    }

    return (
        <CustomCard title={"Projectile"} expanded={expanded}>
            <RecalculateChip visible={refreshable} style={{ marginVertical: 8 }} />

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
                    maxLength={50}
                />
            </SimpleDialog>

            <MuzzleVelocityField />
            <PowderSensField />

        </CustomCard>
    );
};

export default ProjectileCard;
