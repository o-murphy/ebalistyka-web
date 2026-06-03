import { useMemo, useState } from 'react'
import { HitResult, Unit, UnitProps } from 'js-ballistics'
import { useCalculator, usePreferredUnits, useTableSettings, TableSettingsProvider } from '@/context'
import { Section } from '@/components/ui/field'
import { cn } from '@/lib/utils'

const DISPLAY_COLS = [
  { key: 'displayRange', label: 'Range' },
  { key: 'displayVelocity', label: 'Velocity' },
  { key: 'displayHeight', label: 'Height' },
  { key: 'displayDrop', label: 'Drop' },
  { key: 'displayDropAdjustment', label: 'Elev.' },
  { key: 'displayWindage', label: 'Wind' },
  { key: 'displayWindageAdjustment', label: 'W.Adj' },
  { key: 'displayMach', label: 'Mach' },
  { key: 'displayEnergy', label: 'Energy' },
  { key: 'displayTime', label: 'Time' },
]

const TrajectoryTableContent = () => {
  const { hitResult } = useCalculator()
  const { preferredUnits } = usePreferredUnits()
  const { tableSettings, trajectoryStep, updateTableSettings } = useTableSettings()
  const [showSettings, setShowSettings] = useState(false)

  const step = Math.max(1, Math.round(trajectoryStep.asDef))

  const rows = useMemo(() => {
    if (!(hitResult instanceof HitResult)) return []
    return hitResult.trajectory.filter((r) => Math.round(r.distance.In(Unit.Meter)) % step === 0)
  }, [hitResult, step])

  const pu = preferredUnits
  const ts = tableSettings

  if (!(hitResult instanceof HitResult)) {
    return (
      <div className="text-center text-muted-foreground py-12 text-sm">
        No trajectory data. Calculate from the Home screen.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{rows.length} rows (step: {step} m)</span>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="text-xs text-primary hover:underline"
        >
          {showSettings ? 'Hide columns' : 'Show columns'}
        </button>
      </div>

      {showSettings && (
        <div className="rounded-lg border border-border p-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {DISPLAY_COLS.map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={tableSettings[key as keyof typeof tableSettings] as boolean}
                onChange={() => updateTableSettings({ [key]: !tableSettings[key as keyof typeof tableSettings] })}
                className="rounded border-border"
              />
              {label}
            </label>
          ))}
        </div>
      )}

      <div className="overflow-auto rounded-lg border border-border">
        <table className="w-full text-xs tabular-nums">
          <thead className="bg-muted/50 sticky top-0">
            <tr>
              {ts.displayRange && <th className="px-2 py-2 text-right font-medium text-muted-foreground">Range ({UnitProps[pu.distance].symbol})</th>}
              {ts.displayVelocity && <th className="px-2 py-2 text-right font-medium text-muted-foreground">Vel ({UnitProps[pu.velocity].symbol})</th>}
              {ts.displayHeight && <th className="px-2 py-2 text-right font-medium text-muted-foreground">H ({UnitProps[pu.drop].symbol})</th>}
              {ts.displayDrop && <th className="px-2 py-2 text-right font-medium text-muted-foreground">Drop ({UnitProps[pu.drop].symbol})</th>}
              {ts.displayDropAdjustment && <th className="px-2 py-2 text-right font-medium text-muted-foreground">Elev ({UnitProps[pu.adjustment].symbol})</th>}
              {ts.displayWindage && <th className="px-2 py-2 text-right font-medium text-muted-foreground">Wind ({UnitProps[pu.drop].symbol})</th>}
              {ts.displayWindageAdjustment && <th className="px-2 py-2 text-right font-medium text-muted-foreground">W.Adj ({UnitProps[pu.adjustment].symbol})</th>}
              {ts.displayMach && <th className="px-2 py-2 text-right font-medium text-muted-foreground">Mach</th>}
              {ts.displayEnergy && <th className="px-2 py-2 text-right font-medium text-muted-foreground">E ({UnitProps[pu.energy].symbol})</th>}
              {ts.displayTime && <th className="px-2 py-2 text-right font-medium text-muted-foreground">Time (s)</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={cn('border-t border-border', i % 2 === 0 ? '' : 'bg-muted/20')}>
                {ts.displayRange && <td className="px-2 py-1.5 text-right">{row.distance.In(pu.distance).toFixed(0)}</td>}
                {ts.displayVelocity && <td className="px-2 py-1.5 text-right">{row.velocity.In(pu.velocity).toFixed(0)}</td>}
                {ts.displayHeight && <td className="px-2 py-1.5 text-right">{row.height?.In(pu.drop).toFixed(2) ?? '—'}</td>}
                {ts.displayDrop && <td className="px-2 py-1.5 text-right">{row.drop.In(pu.drop).toFixed(2)}</td>}
                {ts.displayDropAdjustment && <td className="px-2 py-1.5 text-right">{row.dropAdjustment.In(pu.adjustment).toFixed(2)}</td>}
                {ts.displayWindage && <td className="px-2 py-1.5 text-right">{row.windage.In(pu.drop).toFixed(2)}</td>}
                {ts.displayWindageAdjustment && <td className="px-2 py-1.5 text-right">{row.windageAdjustment.In(pu.adjustment).toFixed(2)}</td>}
                {ts.displayMach && <td className="px-2 py-1.5 text-right">{row.mach.toFixed(2)}</td>}
                {ts.displayEnergy && <td className="px-2 py-1.5 text-right">{row.energy.In(pu.energy).toFixed(0)}</td>}
                {ts.displayTime && <td className="px-2 py-1.5 text-right">{row.time.toFixed(3)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export const TablesScreen = () => (
  <TableSettingsProvider>
    <TrajectoryTableContent />
  </TableSettingsProvider>
)
