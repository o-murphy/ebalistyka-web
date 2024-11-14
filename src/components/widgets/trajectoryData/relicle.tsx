import { TrajectoryData, UNew } from "js-ballistics/dist/v2"
import { useProfile } from "../../../context/profileContext"
import { Reticle } from "./abstract"


export const TrajectoryReticle = () => {
    const { hitResult } = useProfile()
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
    const { adjustedResult } = useProfile()

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