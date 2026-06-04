import { useMemo } from 'react'
import { HitResult, Unit, UnitProps } from 'js-ballistics'
import { useCalculator, useCurrentConditions, usePreferredUnits } from '@/context'
import { Section, FieldRow } from '@/components/ui/field'

const InfoRow = ({ label, value, unit }: { label: string; value: string; unit?: string }) => (
  <FieldRow label={label}>
    <span className="text-sm font-medium tabular-nums">
      {value}
      {unit && <span className="text-muted-foreground ml-1">{unit}</span>}
    </span>
  </FieldRow>
)

export const ShotInfoScreen = () => {
  const { adjustedResult, hitResult, inProgress } = useCalculator()
  const { targetDistance } = useCurrentConditions()
  const { preferredUnits } = usePreferredUnits()

  const info = useMemo(() => {
    if (!(adjustedResult instanceof HitResult)) return null
    const traj = adjustedResult.trajectory
    const targetDist = targetDistance.asDef
    const targetRow = traj.filter((r) => r.distance.In(Unit.Meter) <= targetDist + 1).at(-1)
    return {
      elevation: adjustedResult.shot?.relativeAngle,
      windage: targetRow?.windageAngle,
      velocity: targetRow?.velocity,
      energy: targetRow?.energy,
      time: targetRow?.time,
      mach: targetRow?.mach,
    }
  }, [adjustedResult, targetDistance.asDef])

  const pu = preferredUnits

  if (inProgress) {
    return (
      <div className="flex items-center justify-center h-32 gap-2 text-muted-foreground">
        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span>Calculating…</span>
      </div>
    )
  }

  if (!info) {
    return (
      <div className="text-center text-muted-foreground py-12 text-sm">
        No shot data. Calculate from the Home screen.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 max-w-xl mx-auto">
      <Section title="Target">
        <InfoRow
          label="Distance"
          value={targetDistance.asString}
          unit={targetDistance.symbol}
        />
      </Section>

      <Section title="Hold">
        {info.elevation && (
          <InfoRow
            label="Elevation"
            value={info.elevation.In(pu.adjustment).toFixed(UnitProps[pu.adjustment].accuracy)}
            unit={UnitProps[pu.adjustment].symbol}
          />
        )}
        {info.windage && (
          <InfoRow
            label="Windage"
            value={info.windage.In(pu.adjustment).toFixed(UnitProps[pu.adjustment].accuracy)}
            unit={UnitProps[pu.adjustment].symbol}
          />
        )}
      </Section>

      <Section title="At Target">
        {info.velocity && (
          <InfoRow
            label="Velocity"
            value={info.velocity.In(pu.velocity).toFixed(0)}
            unit={UnitProps[pu.velocity].symbol}
          />
        )}
        {info.energy && (
          <InfoRow
            label="Energy"
            value={info.energy.In(pu.energy).toFixed(0)}
            unit={UnitProps[pu.energy].symbol}
          />
        )}
        {info.time !== undefined && (
          <InfoRow label="Time of flight" value={info.time.toFixed(3)} unit="s" />
        )}
        {info.mach !== undefined && (
          <InfoRow label="Mach" value={info.mach.toFixed(3)} />
        )}
      </Section>
    </div>
  )
}
