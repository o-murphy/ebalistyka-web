import { useEffect, useMemo } from 'react'
import { HitResult, Unit, Velocity } from 'js-ballistics'
import { useCalculator, useCurrentConditions, usePreferredUnits } from '@/context'
import { useDimension } from '@/hooks'
import { DimensionInput, NumeralInput, Section, FieldRow } from '@/components/ui/field'

const CurrentMuzzleVelocity = () => {
  const { adjustedResult } = useCalculator()
  const { temperature, powderTemperature, flags } = useCurrentConditions()
  const { preferredUnits } = usePreferredUnits()

  const muzzleVelocity = useDimension({
    measure: Velocity,
    defUnit: Unit.MPS,
    prefUnitFlag: 'velocity',
    min: 0,
    max: 3000,
    precision: 1,
  })

  useEffect(() => {
    if (adjustedResult instanceof HitResult) {
      muzzleVelocity.setValue(adjustedResult.trajectory[0].velocity)
    }
  }, [adjustedResult])

  if (!(adjustedResult instanceof HitResult)) return null

  const tempLabel = flags.useDifferentPowderTemperature
    ? `${powderTemperature.asString} ${powderTemperature.symbol}`
    : `${temperature.asString} ${temperature.symbol}`

  return (
    <FieldRow label={`Muzzle velocity @ ${tempLabel} powder temp`}>
      <span className="text-sm font-medium">
        {muzzleVelocity.asString} {muzzleVelocity.symbol}
      </span>
    </FieldRow>
  )
}

export const WeatherScreen = () => {
  const { flags, updateFlags, temperature, pressure, humidity, windSpeed, windDirection, powderTemperature } =
    useCurrentConditions()

  return (
    <div className="flex flex-col gap-4 max-w-xl mx-auto">
      <Section title="Atmosphere">
        <div className="grid grid-cols-2 gap-3">
          <DimensionInput label="Temperature" dimension={temperature} />
          <NumeralInput label="Humidity" numeral={humidity} />
          <DimensionInput label="Pressure" dimension={pressure} />
        </div>
      </Section>

      <Section title="Wind">
        <div className="grid grid-cols-2 gap-3">
          <DimensionInput label="Wind Speed" dimension={windSpeed} />
          <DimensionInput label="Wind Direction" dimension={windDirection} />
        </div>
      </Section>

      <Section title="Powder Sensitivity">
        <div className="space-y-3">
          <FieldRow label="Use powder sensitivity">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={flags.usePowderSens}
                onChange={() => updateFlags({ usePowderSens: !flags.usePowderSens })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-muted rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
            </label>
          </FieldRow>

          {flags.usePowderSens && (
            <FieldRow label="Use different powder temperature">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={flags.useDifferentPowderTemperature}
                  onChange={() =>
                    updateFlags({ useDifferentPowderTemperature: !flags.useDifferentPowderTemperature })
                  }
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-muted rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
              </label>
            </FieldRow>
          )}

          {flags.usePowderSens && flags.useDifferentPowderTemperature && (
            <DimensionInput label="Powder Temperature" dimension={powderTemperature} />
          )}

          {flags.usePowderSens && <CurrentMuzzleVelocity />}
        </div>
      </Section>
    </div>
  )
}
