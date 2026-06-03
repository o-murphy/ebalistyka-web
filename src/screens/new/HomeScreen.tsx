import { useMemo } from 'react'
import { HitResult, Unit, UnitProps } from 'js-ballistics'
import { useCalculator, useProfile, useCurrentConditions, usePreferredUnits } from '@/context'
import { DimensionInput, Section } from '@/components/ui/field'
import { cn } from '@/lib/utils'

const holdUnits = [Unit.MIL, Unit.MOA, Unit.MRad, Unit.CmPer100M, Unit.InchesPer100Yd]

const HoldColumn = ({
  label,
  value,
  preferredUnit,
}: {
  label: string
  value: any | null
  preferredUnit: Unit
}) => (
  <div className="flex flex-col gap-2">
    <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</div>
    {value ? (
      <>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold tabular-nums">
            {value.In(preferredUnit).toFixed(UnitProps[preferredUnit].accuracy)}
          </span>
          <span className="text-sm text-muted-foreground">{UnitProps[preferredUnit].symbol}</span>
        </div>
        <div className="space-y-0.5">
          {holdUnits
            .filter((u) => u !== preferredUnit)
            .map((u) => (
              <div key={u} className="text-xs text-muted-foreground tabular-nums">
                {UnitProps[u].symbol}: {value.In(u).toFixed(UnitProps[u].accuracy)}
              </div>
            ))}
        </div>
      </>
    ) : (
      <div className="text-2xl text-muted-foreground">—</div>
    )}
  </div>
)

export const HomeScreen = () => {
  const { fire, adjustedResult, inProgress } = useCalculator()
  const { profileProperties } = useProfile()
  const { windSpeed, lookAngle, targetDistance, windDirection } = useCurrentConditions()
  const { preferredUnits } = usePreferredUnits()

  const hold = useMemo(() => {
    if (!(adjustedResult instanceof HitResult)) return null
    const trajectory = adjustedResult.trajectory
    const targetDist = targetDistance.asDef
    const targetRow = trajectory.filter((r) => r.distance.In(Unit.Meter) <= targetDist + 1).at(-1)
    return {
      elevation: adjustedResult.shot?.relativeAngle ?? null,
      windage: targetRow?.windageAdjustment ?? null,
    }
  }, [adjustedResult, targetDistance.asDef])

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto">
      {/* Profile info */}
      <Section title="Profile">
        {profileProperties ? (
          <div className="space-y-1">
            <div className="text-base font-semibold">
              {profileProperties.shortNameTop} / {profileProperties.shortNameBot}
            </div>
            <div className="text-sm text-muted-foreground">{profileProperties.cartridgeName}</div>
            <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
              <span>{profileProperties.bulletName}</span>
              <span>
                {profileProperties.bcType}: {(profileProperties.coefRows?.[0]?.bcCd / 10000).toFixed(3)}
              </span>
              <span>{(profileProperties.bWeight / 10).toFixed(1)} gr</span>
              <span>{(profileProperties.cMuzzleVelocity / 10).toFixed(0)} m/s</span>
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">No profile loaded. Go to Profile screen to load a .a7p file.</div>
        )}
      </Section>

      {/* Shot conditions */}
      <Section title="Shot Conditions">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <DimensionInput label="Distance" dimension={targetDistance} />
          <DimensionInput label="Wind Speed" dimension={windSpeed} />
          <DimensionInput label="Wind Dir" dimension={windDirection} />
          <DimensionInput label="Look Angle" dimension={lookAngle} />
        </div>
      </Section>

      {/* Hold result */}
      <Section title="Hold">
        {inProgress ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Calculating…</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            <HoldColumn
              label="Elevation"
              value={hold?.elevation ?? null}
              preferredUnit={preferredUnits.adjustment}
            />
            <HoldColumn
              label="Windage"
              value={hold?.windage ?? null}
              preferredUnit={preferredUnits.adjustment}
            />
          </div>
        )}
      </Section>

      {/* Recalculate */}
      <button
        onClick={() => fire()}
        disabled={inProgress}
        className={cn(
          'w-full py-2.5 px-4 rounded-lg text-sm font-medium transition-colors',
          'bg-primary text-primary-foreground hover:bg-primary/90',
          'disabled:opacity-50 disabled:cursor-not-allowed',
        )}
      >
        {inProgress ? 'Calculating…' : '↺ Recalculate'}
      </button>
    </div>
  )
}
