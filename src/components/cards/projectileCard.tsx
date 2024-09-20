import { TextInput } from "react-native-paper";
import React from "react";
import InputCard from "./inputCard";
import SimpleDialog from "../dialogs/simpleDialog";
import { Unit, UnitProps } from "js-ballistics/dist/v2";
import MeasureFormField, { MeasureFormFieldProps, styles as measureFormFieldStyles } from "../widgets/measureField";

interface ProjectileCardProps {
    expanded?: boolean;
}

const ProjectileCard: React.FC<ProjectileCardProps> = ({ expanded = true }) => {
    const [curName, setCurName] = React.useState<string>("My projectile");
    const [name, setName] = React.useState<string>(curName);

    const acceptName = () => {
        setCurName(name);
    };

    const declineName = () => {
        setName(curName);
    };

    return (
        <InputCard title={"Projectile"} expanded={expanded}>
            <SimpleDialog
                style={measureFormFieldStyles.nameContainer}
                label={"Name"}
                icon={"card-bulleted-outline"}
                text={curName}
                onAccept={acceptName}
                onDecline={declineName}
            >
                <TextInput value={name} onChangeText={setName} />
            </SimpleDialog>

            {fields.map(field => <MeasureFormField key={field.key} field={field} />)}
        </InputCard>
    );
};

const fields: MeasureFormFieldProps[] = [
    {
        key: "mv",
        label: "Muzzle velocity",
        suffix: UnitProps[Unit.MPS].symbol,
        icon: "speedometer",
        initialValue: 805,
        maxValue: 2000,
        minValue: 10,
        decimals: 0,
    },
    {
        key: "powder_sens",
        label: "Temperature sens.",
        suffix: "/15°C",
        icon: "percent",
        initialValue: 1,
        maxValue: 5,
        minValue: 0,
        decimals: 2,
    },
];

export default ProjectileCard;
