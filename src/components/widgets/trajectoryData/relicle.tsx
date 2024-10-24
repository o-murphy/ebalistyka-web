import { Distance, TrajectoryData, UNew, Unit } from "js-ballistics/dist/v2"
import { usePreferredUnits } from "../../../context/preferredUnitsContext"
import { useCalculator } from "../../../context/profileContext"
import { Reticle } from "./abstract"


export const TrajectoryReticle = () => {
    const { hitResult } = useCalculator()
    if (!(hitResult instanceof Error)) {
        const trajectory = [...hitResult?.trajectory]
        trajectory.shift()
        return (
            <Reticle trajectory={trajectory}/>
        )
    }
    return null
}

export const AdjustedReticle = () => {
    const { adjustedResult } = useCalculator()

    if (!(adjustedResult instanceof Error)) {

        const hold = adjustedResult.shot.relativeAngle
        const trajectory: TrajectoryData[] = [...adjustedResult?.trajectory]
        const holdRow = trajectory.reduce((min, item) => item.dropAdjustment < min.dropAdjustment ? item : min, trajectory[0]);

        const holdPoint = {
            ...holdRow,
            dropAdjustment: UNew.Radian(-hold.rawValue)
        }

        return (
            <Reticle trajectory={[holdPoint]} step={1}/>
        )
    }
    return null
}