import React from "react";
import InputCard from "./inputCard";
import {Unit, UnitProps} from "js-ballistics/dist/v2";
import MeasureFormField, { MeasureFormFieldProps } from "../widgets/measureField";


export default function AtmoCard({label = "Zero atmosphere", expanded = true}) {

    const me = AtmoCard.name

    const [curName, setCurName] = React.useState("My rifle");
    const [name, setName] = React.useState(curName);

    const acceptName = () => {
        setCurName(name)
    }

    const declineName = () => {
        setName(curName)
    }

    return (
        <InputCard title={label} expanded={expanded}>
            {fields.map(field => <MeasureFormField key={field.key} field={field} />)}
        </InputCard>
    )
}

const fields: MeasureFormFieldProps[] = [
    {
        key: "temp",
        label: "Temperature",
        suffix: UnitProps[Unit.Celsius].symbol,
        icon: "thermometer",
        initialValue: 15,
        maxValue: 50,
        minValue: -50,
        decimals: 0
    },
    {
        key: "pressure",
        label: "Pressure",
        suffix: UnitProps[Unit.MmHg].symbol,
        icon: "speedometer",
        initialValue: 760,
        maxValue: 1000,
        minValue: 700,
        decimals: 0
    },
    {
        key: "humidity",
        label: "Humidity",
        suffix: "%",
        icon: "water",
        initialValue: 78,
        maxValue: 100,
        minValue: 0,
        decimals: 0
    },
    {
        key: "altitude",
        label: "Altitude",
        suffix: UnitProps[Unit.Meter].symbol,
        icon: "ruler",
        initialValue: 150,
        maxValue: 3000,
        minValue: 0,
        decimals: 0,
    },
]