import { useState } from 'react'
import { Angular, Energy, Pressure, Temperature, Unit, UnitProps, Weight } from 'js-ballistics'
import { usePreferredUnits, useAppSettings } from '@/context'
import { DimensionInput, Section, FieldRow } from '@/components/ui/field'
import { cn } from '@/lib/utils'

const getUnitList = (measure: object): Unit[] =>
  Object.values(measure) as Unit[]

interface UnitSelectProps {
  label: string
  unitKey: string
  options: { label: string; value: Unit }[]
}

const UnitSelect = ({ label, unitKey, options }: UnitSelectProps) => {
  const { preferredUnits, setPreferredUnits } = usePreferredUnits()
  const current = (preferredUnits as any)[unitKey] as Unit

  return (
    <FieldRow label={label}>
      <select
        value={current}
        onChange={(e) =>
          setPreferredUnits((prev) => ({ ...prev, [unitKey]: Number(e.target.value) as Unit }))
        }
        className={cn(
          'bg-background border border-border rounded px-2 py-1 text-sm',
          'focus:outline-none focus:ring-1 focus:ring-ring',
        )}
      >
        {options.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </FieldRow>
  )
}

const unitOptions = (measure: object) =>
  getUnitList(measure)
    .map((u) => ({ value: u, label: UnitProps[u]?.name ?? String(u) }))
    .filter((o) => o.label)

export const SettingsScreen = () => {
  const { homeScreenDistanceStep } = useAppSettings()

  return (
    <div className="flex flex-col gap-4 max-w-xl mx-auto">
      <Section title="Preferred Units">
        <UnitSelect
          label="Distance"
          unitKey="distance"
          options={[Unit.Meter, Unit.Foot, Unit.Yard].map((u) => ({
            value: u,
            label: UnitProps[u]?.name ?? String(u),
          }))}
        />
        <UnitSelect
          label="Velocity"
          unitKey="velocity"
          options={[Unit.MPS, Unit.FPS, Unit.KMH, Unit.MPH].map((u) => ({
            value: u,
            label: UnitProps[u]?.name ?? String(u),
          }))}
        />
        <UnitSelect
          label="Sizes"
          unitKey="sizes"
          options={[Unit.Inch, Unit.Millimeter, Unit.Centimeter, Unit.Line].map((u) => ({
            value: u,
            label: UnitProps[u]?.name ?? String(u),
          }))}
        />
        <UnitSelect
          label="Angular"
          unitKey="angular"
          options={unitOptions(Angular)}
        />
        <UnitSelect
          label="Adjustment"
          unitKey="adjustment"
          options={unitOptions(Angular)}
        />
        <UnitSelect
          label="Drop"
          unitKey="drop"
          options={[Unit.Inch, Unit.Millimeter, Unit.Centimeter, Unit.Line, Unit.Meter, Unit.Yard].map(
            (u) => ({ value: u, label: UnitProps[u]?.name ?? String(u) }),
          )}
        />
        <UnitSelect
          label="Weight"
          unitKey="weight"
          options={unitOptions(Weight)}
        />
        <UnitSelect
          label="Temperature"
          unitKey="temperature"
          options={unitOptions(Temperature)}
        />
        <UnitSelect
          label="Pressure"
          unitKey="pressure"
          options={unitOptions(Pressure)}
        />
        <UnitSelect
          label="Energy"
          unitKey="energy"
          options={unitOptions(Energy)}
        />
      </Section>

      <Section title="Home Screen">
        <DimensionInput label="Trajectory step (distance)" dimension={homeScreenDistanceStep} />
      </Section>
    </div>
  )
}
