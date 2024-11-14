import React from "react"
import { DimensionDialog } from "../../components";
import { useCurrentConditions } from "../../../../context/currentConditions";



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

// const WeatherPowderTemperatureDialog: React.FC<{ button: React.ReactElement }> = ({ button }) => {
//     const { powderTemperature } = useCurrentConditions()

//     return (
//         <DimensionDialog
//             button={button}
//             label="Powder temperature"
//             icon="thermometer"
//             dimension={powderTemperature}
//             enableSlider
//         />
//     )
// };

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
    // WeatherPowderTemperatureDialog,
};