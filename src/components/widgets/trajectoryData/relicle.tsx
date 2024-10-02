import { TrajectoryData, UNew, Unit } from "js-ballistics/dist/v2"
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
        const trajectory = adjustedResult?.trajectory.map(row => {
            return {
                ...row, dropAdjustment: UNew.Radian(row.dropAdjustment.In(Unit.Radian) - adjustedResult.shot.relativeAngle.In(Unit.Radian))
            }
        })
        trajectory.shift()
        return (
            <Reticle trajectory={trajectory}/>
        )  
    }
    return null
}