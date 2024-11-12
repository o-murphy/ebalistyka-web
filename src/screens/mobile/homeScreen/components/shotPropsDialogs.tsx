import React from "react";
import { useCurrentConditions } from "../../../../context/currentConditions";
import { ValueDialog } from "../../components";


export const WindSpeedDialog: React.FC<{ button: React.ReactElement }> = ({ button }) => {
    const { windSpeed } = useCurrentConditions()

    return (
        <ValueDialog
            button={button}
            label="Wind speed"
            icon="windsock"
            dimension={windSpeed}
            enableSlider
        />
    )
}

export const LookAngleDialog: React.FC<{ button: React.ReactElement }> = ({ button }) => {
    const { lookAngle } = useCurrentConditions()

    return (
        <ValueDialog
            button={button}
            label="Look angle"
            icon="angle-acute"
            dimension={lookAngle}
            enableSlider
        />
    )
}

export const TargetDistanceDialog: React.FC<{ button: React.ReactElement }> = ({ button }) => {
    const { targetDistance } = useCurrentConditions()

    return (
        <ValueDialog
            button={button}
            label="Target distance"
            icon="map-marker-distance"
            dimension={targetDistance}
            enableSlider
        />
    )
}
