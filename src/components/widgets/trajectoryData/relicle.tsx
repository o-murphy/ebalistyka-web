import { TrajectoryData, UNew } from "js-ballistics"
import { useCalculator } from "../../../context"
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
        const holdRow = trajectory.slice(1).reduce((closest, item) => Math.abs(item.dropAdjustment.rawValue) < Math.abs(closest.dropAdjustment.rawValue) ? item : closest, trajectory[1]);

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