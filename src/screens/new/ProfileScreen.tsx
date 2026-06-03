import { useRef } from 'react'
import { useProfile } from '@/context'
import { DimensionInput, NumeralInput, Section, FieldRow } from '@/components/ui/field'

const FileUpload = () => {
  const { fetchBinaryFile } = useProfile()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    fetchBinaryFile(url).finally(() => URL.revokeObjectURL(url))
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => inputRef.current?.click()}
        className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-accent transition-colors"
      >
        Load .a7p profile
      </button>
      <input ref={inputRef} type="file" accept=".a7p" onChange={handleFile} className="hidden" />
    </div>
  )
}

export const ProfileScreen = () => {
  const {
    profileProperties,
    scHeight,
    rTwist,
    cZeroWPitch,
    zeroDistance,
    cMuzzleVelocity,
    cZeroTemperature,
    cTCoeff,
    bDiameter,
    bLength,
    bWeight,
    cZeroAirTemperature,
    cZeroAirPressure,
    cZeroAirHumidity,
    cZeroPTemperature,
  } = useProfile()

  return (
    <div className="flex flex-col gap-4 max-w-xl mx-auto">
      <Section title="Profile File">
        <FileUpload />
        {profileProperties && (
          <div className="mt-3 space-y-0.5 text-sm text-muted-foreground">
            <div className="font-medium text-foreground">{profileProperties.profileName}</div>
            <div>{profileProperties.cartridgeName}</div>
            <div>{profileProperties.bulletName}</div>
            <div className="text-xs mt-1">
              {profileProperties.caliber} | {profileProperties.bcType}: {(profileProperties.coefRows?.[0]?.bcCd / 10000).toFixed(3)}
            </div>
          </div>
        )}
      </Section>

      <Section title="Weapon">
        <div className="grid grid-cols-2 gap-3">
          <DimensionInput label="Sight height" dimension={scHeight} />
          <DimensionInput label="Twist rate" dimension={rTwist} />
          <DimensionInput label="Zero distance" dimension={zeroDistance} />
          <DimensionInput label="Zero pitch" dimension={cZeroWPitch} />
        </div>
      </Section>

      <Section title="Bullet / Ammunition">
        <div className="grid grid-cols-2 gap-3">
          <DimensionInput label="Muzzle velocity" dimension={cMuzzleVelocity} />
          <DimensionInput label="Powder temp (zero)" dimension={cZeroTemperature} />
          <NumeralInput label="Temp coefficient" numeral={cTCoeff} />
        </div>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <DimensionInput label="Diameter" dimension={bDiameter} />
          <DimensionInput label="Length" dimension={bLength} />
          <DimensionInput label="Weight" dimension={bWeight} />
        </div>
      </Section>

      <Section title="Zero Conditions">
        <div className="grid grid-cols-2 gap-3">
          <DimensionInput label="Air temperature" dimension={cZeroAirTemperature} />
          <DimensionInput label="Air pressure" dimension={cZeroAirPressure} />
          <NumeralInput label="Humidity" numeral={cZeroAirHumidity} />
          <DimensionInput label="Powder temperature" dimension={cZeroPTemperature} />
        </div>
      </Section>
    </div>
  )
}
