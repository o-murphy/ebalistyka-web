import { useMemo } from 'react'
import { HitResult, Unit, UnitProps } from 'js-ballistics'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { useCalculator, usePreferredUnits } from '@/context'
import { Section } from '@/components/ui/field'

export const ChartsScreen = () => {
  const { hitResult, inProgress } = useCalculator()
  const { preferredUnits } = usePreferredUnits()

  const pu = preferredUnits

  const data = useMemo(() => {
    if (!(hitResult instanceof HitResult)) return []
    return hitResult.trajectory
      .filter((_, i) => i % 10 === 0)
      .map((row) => ({
        range: Math.round(row.distance.In(pu.distance)),
        elevation: parseFloat(row.dropAngle.In(pu.adjustment).toFixed(2)),
        windage: parseFloat(row.windageAngle.In(pu.adjustment).toFixed(2)),
        velocity: Math.round(row.velocity.In(pu.velocity)),
        mach: parseFloat(row.mach.toFixed(2)),
      }))
  }, [hitResult, pu])

  if (inProgress) {
    return (
      <div className="flex items-center justify-center h-32 gap-2 text-muted-foreground">
        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span>Calculating…</span>
      </div>
    )
  }

  if (!data.length) {
    return (
      <div className="text-center text-muted-foreground py-12 text-sm">
        No trajectory data. Calculate from the Home screen.
      </div>
    )
  }

  const adjSymbol = UnitProps[pu.adjustment]?.symbol ?? ''
  const distSymbol = UnitProps[pu.distance]?.symbol ?? ''
  const velSymbol = UnitProps[pu.velocity]?.symbol ?? ''

  return (
    <div className="flex flex-col gap-6">
      <Section title={`Elevation & Windage (${adjSymbol}) vs Range (${distSymbol})`}>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="range"
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              stroke="#475569"
              label={{ value: distSymbol, position: 'insideBottomRight', offset: -4, fontSize: 11, fill: '#94a3b8' }}
            />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} stroke="#475569" />
            <Tooltip
              contentStyle={{
                background: '#1e293b',
                border: '1px solid #334155',
                borderRadius: 8,
                fontSize: 12,
                color: '#f1f5f9',
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
            <Line
              type="monotone"
              dataKey="elevation"
              name={`Elevation (${adjSymbol})`}
              stroke="#38bdf8"
              dot={false}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="windage"
              name={`Windage (${adjSymbol})`}
              stroke="#f97316"
              dot={false}
              strokeWidth={2}
              strokeDasharray="4 2"
            />
          </LineChart>
        </ResponsiveContainer>
      </Section>

      <Section title={`Velocity (${velSymbol}) vs Range (${distSymbol})`}>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#94a3b8' }} stroke="#475569" />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} stroke="#475569" />
            <Tooltip
              contentStyle={{
                background: '#1e293b',
                border: '1px solid #334155',
                borderRadius: 8,
                fontSize: 12,
                color: '#f1f5f9',
              }}
            />
            <Line
              type="monotone"
              dataKey="velocity"
              name={`Velocity (${velSymbol})`}
              stroke="#4ade80"
              dot={false}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Section>

      <Section title={`Mach vs Range (${distSymbol})`}>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#94a3b8' }} stroke="#475569" />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} stroke="#475569" />
            <Tooltip
              contentStyle={{
                background: '#1e293b',
                border: '1px solid #334155',
                borderRadius: 8,
                fontSize: 12,
                color: '#f1f5f9',
              }}
            />
            <Line
              type="monotone"
              dataKey="mach"
              name="Mach"
              stroke="#c084fc"
              dot={false}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Section>
    </div>
  )
}
