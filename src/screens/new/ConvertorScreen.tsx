import { useState, useMemo } from 'react'
import { Distance, Velocity, Angular, Temperature, Pressure, Weight, Energy, Unit, UnitProps } from 'js-ballistics'
import { Section } from '@/components/ui/field'
import { cn } from '@/lib/utils'

type MeasureEntry = {
  label: string
  measure: any
  units: Unit[]
}

const MEASURES: MeasureEntry[] = [
  {
    label: 'Distance',
    measure: Distance,
    units: [Unit.Meter, Unit.Foot, Unit.Yard, Unit.Inch, Unit.Millimeter, Unit.Centimeter, Unit.Line],
  },
  {
    label: 'Velocity',
    measure: Velocity,
    units: [Unit.MPS, Unit.FPS, Unit.KMH, Unit.MPH],
  },
  {
    label: 'Angular',
    measure: Angular,
    units: [Unit.Degree, Unit.MIL, Unit.MOA, Unit.MRad, Unit.CmPer100M, Unit.InchesPer100Yd],
  },
  {
    label: 'Temperature',
    measure: Temperature,
    units: [Unit.Celsius, Unit.Fahrenheit, Unit.Kelvin],
  },
  {
    label: 'Pressure',
    measure: Pressure,
    units: [Unit.hPa, Unit.mmHg, Unit.inHg, Unit.Bar, Unit.PSI],
  },
  {
    label: 'Weight',
    measure: Weight,
    units: [Unit.Grain, Unit.Gram, Unit.Kilogram, Unit.Ounce, Unit.Pound, Unit.Newton],
  },
  {
    label: 'Energy',
    measure: Energy,
    units: [Unit.FootPound, Unit.Joule],
  },
]

export const ConvertorScreen = () => {
  const [measureIdx, setMeasureIdx] = useState(0)
  const [fromUnit, setFromUnit] = useState<Unit | null>(null)
  const [toUnit, setToUnit] = useState<Unit | null>(null)
  const [inputVal, setInputVal] = useState('')

  const measure = MEASURES[measureIdx]
  const from = fromUnit ?? measure.units[0]
  const to = toUnit ?? measure.units[1] ?? measure.units[0]

  const result = useMemo(() => {
    const num = parseFloat(inputVal)
    if (isNaN(num) || !measure.measure) return ''
    try {
      const dim = new measure.measure(num, from)
      return dim.In(to).toFixed(4)
    } catch {
      return ''
    }
  }, [inputVal, from, to, measure])

  const unitName = (u: Unit) => UnitProps[u]?.name ?? String(u)
  const unitSymbol = (u: Unit) => UnitProps[u]?.symbol ?? String(u)

  const handleMeasureChange = (idx: number) => {
    setMeasureIdx(idx)
    setFromUnit(null)
    setToUnit(null)
    setInputVal('')
  }

  return (
    <div className="flex flex-col gap-4 max-w-xl mx-auto">
      <Section title="Measurement Type">
        <div className="flex flex-wrap gap-2">
          {MEASURES.map((m, i) => (
            <button
              key={i}
              onClick={() => handleMeasureChange(i)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm border transition-colors',
                i === measureIdx
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground hover:bg-accent',
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Convert">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">From</label>
            <select
              value={from}
              onChange={(e) => setFromUnit(Number(e.target.value) as Unit)}
              className="bg-background border border-border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {measure.units.map((u) => (
                <option key={u} value={u}>
                  {unitName(u)} ({unitSymbol(u)})
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">To</label>
            <select
              value={to}
              onChange={(e) => setToUnit(Number(e.target.value) as Unit)}
              className="bg-background border border-border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {measure.units.map((u) => (
                <option key={u} value={u}>
                  {unitName(u)} ({unitSymbol(u)})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Input ({unitSymbol(from)})</label>
            <input
              type="number"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="0"
              className="bg-background border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Result ({unitSymbol(to)})</label>
            <div className="bg-muted border border-border rounded px-3 py-2 text-sm font-medium tabular-nums min-h-[36px]">
              {result || '—'}
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}
