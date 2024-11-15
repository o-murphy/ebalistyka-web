import React from "react"
import { DimensionDialog } from "../../../components/widgets";
import { useCurrentConditions } from "../../../context";


const WeatherTemperatureDialog: React.FC<{ button: React.ReactElement }> = ({ button }) => {
    const { temperature } = useCurrentConditions()
    return (
        <DimensionDialog
            button={button}
            label="Temperature"
            icon="thermometer"
            dimension={temperature}
            enableSlider
        />
    )
};

const WeatherPressureDialog: React.FC<{ button: React.ReactElement }> = ({ button }) => {
    const { pressure } = useCurrentConditions()

    return (
        <DimensionDialog
            button={button}
            label="Pressure"
            icon="thermometer"
            dimension={pressure}
            enableSlider
        />
    )
};


export {
    WeatherTemperatureDialog,
    WeatherPressureDialog,
};