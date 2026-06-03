import { cn } from '@/lib/utils'
import type { DimensionProps, NumeralProps } from '@/hooks'

interface DimensionInputProps {
  label?: string
  dimension: DimensionProps
  className?: string
  disabled?: boolean
}

export const DimensionInput = ({ label, dimension, className, disabled }: DimensionInputProps) => {
  const step = Math.pow(10, -dimension.accuracy)

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label && <label className="text-xs text-muted-foreground">{label}</label>}
      <div className="flex items-center gap-1">
        <input
          type="number"
          value={dimension.asPref.toFixed(dimension.accuracy)}
          min={dimension.rangePref.min}
          max={dimension.rangePref.max}
          step={step}
          disabled={disabled}
          onChange={(e) => {
            const val = parseFloat(e.target.value)
            if (!isNaN(val)) dimension.setAsPref(val)
          }}
          className={cn(
            'flex-1 min-w-0 bg-background border border-border rounded px-2 py-1.5 text-sm text-right',
            'focus:outline-none focus:ring-1 focus:ring-ring',
            !dimension.isValid && 'border-destructive',
            disabled && 'opacity-50 cursor-not-allowed',
          )}
        />
        <span className="text-xs text-muted-foreground w-8 shrink-0">{dimension.symbol}</span>
      </div>
    </div>
  )
}

interface NumeralInputProps {
  label?: string
  numeral: NumeralProps
  className?: string
  disabled?: boolean
}

export const NumeralInput = ({ label, numeral, className, disabled }: NumeralInputProps) => {
  const step = Math.pow(10, -numeral.accuracy)

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label && <label className="text-xs text-muted-foreground">{label}</label>}
      <div className="flex items-center gap-1">
        <input
          type="number"
          value={numeral.value.toFixed(numeral.accuracy)}
          min={numeral.range.min}
          max={numeral.range.max}
          step={step}
          disabled={disabled}
          onChange={(e) => {
            const val = parseFloat(e.target.value)
            if (!isNaN(val)) numeral.setValue(val)
          }}
          className={cn(
            'flex-1 min-w-0 bg-background border border-border rounded px-2 py-1.5 text-sm text-right',
            'focus:outline-none focus:ring-1 focus:ring-ring',
            !numeral.isValid && 'border-destructive',
            disabled && 'opacity-50 cursor-not-allowed',
          )}
        />
        <span className="text-xs text-muted-foreground shrink-0">{numeral.symbol}</span>
      </div>
    </div>
  )
}

interface FieldRowProps {
  label: string
  children: React.ReactNode
  className?: string
}

export const FieldRow = ({ label, children, className }: FieldRowProps) => (
  <div className={cn('flex items-center justify-between gap-4 py-2 border-b border-border last:border-0', className)}>
    <span className="text-sm text-muted-foreground shrink-0">{label}</span>
    <div className="flex items-center gap-1 min-w-0">{children}</div>
  </div>
)

interface SectionProps {
  title: string
  children: React.ReactNode
  className?: string
}

export const Section = ({ title, children, className }: SectionProps) => (
  <div className={cn('rounded-lg border border-border p-4', className)}>
    <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">{title}</h3>
    {children}
  </div>
)
