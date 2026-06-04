import {
    Calculator,
    Ammo, Atmo, BCPoint, DragModelMultiBC, Shot, UNew, Weapon,
    DragModel, DragTables,
    HitResult,
    Wind,
    TrajFlag,
} from 'js-ballistics';
import { ProfileProps } from './parseA7P';
import { Unit } from 'js-ballistics';
import { DimensionProps } from '../hooks';

export interface PreparedZeroData {
    weapon: Weapon;
    ammo: Ammo;
    calc: Calculator;
    error: Error | null;
}

export interface CurrentConditionsValues {
    temperature: number;
    pressure: number;
    humidity: number;
    windSpeed: number;
    windDirection: number;
    lookAngle: number;
    targetDistance: number,
    usePowderSens: boolean,
    useDifferentPowderTemperature: boolean,
    powderTemperature: number,
}


export interface CurrentConditionsType {
    flags: {
        usePowderSens: boolean,
        useDifferentPowderTemperature: boolean,
    },
    temperature: DimensionProps;
    pressure: DimensionProps;
    humidity: number;
    windSpeed: DimensionProps;
    windDirection: DimensionProps;
    lookAngle: DimensionProps;
    targetDistance: DimensionProps,
    powderTemperature: DimensionProps,
}


const dragModel = (profile: ProfileProps) => {
    switch (profile.bcType) {
        case "G7":
            return {
                dragTable: "G7" as const,
                bcPoints: profile.coefRows.map((row) => new BCPoint({
                    BC: row.bcCd / 10000,
                    V: UNew.MPS(row.mv / 10),
                })),
            };
        case "G1":
            return {
                dragTable: "G1" as const,
                bcPoints: profile.coefRows.map((row) => new BCPoint({
                    BC: row.bcCd / 10000,
                    V: UNew.MPS(row.mv / 10),
                })),
            };
        default:
            return {
                dragTable: profile.coefRows.map((item) => ({ Mach: item.mv, CD: item.bcCd })),
                bcPoints: null,
            };
    }
};

export const prepareCalculator = async (profile: ProfileProps, currentConditions: CurrentConditionsType): Promise<PreparedZeroData> => {

    const zeroData = {
        atmo: {
            pressure: UNew.hPa(profile.cZeroAirPressure),
            temperature: UNew.Celsius(profile.cZeroAirTemperature),
            humidity: profile.cZeroAirHumidity,
        },
        weapon: {
            sightHeight: UNew.Millimeter(profile.scHeight),
            twist: UNew.Inch(profile.rTwist * (profile.twistDir === "RIGHT" ? 1 : -1)),
        },
        lookAngle: UNew.Degree(profile.cZeroWPitch),
        zeroDistance: UNew.Meter(profile.zeroDistance)
    }

    const zeroAtmo = new Atmo(zeroData.atmo);
    const zeroWeapon = new Weapon(zeroData.weapon);

    const { dragTable, bcPoints } = dragModel(profile);
    const bulletProps = {
        weight: UNew.Grain(profile.bWeight),
        diameter: UNew.Inch(profile.bDiameter),
        length: UNew.Inch(profile.bLength),
    };

    let dm;
    if (bcPoints) {
        dm = DragModelMultiBC({
            bcPoints: profile.coefRows.map((row) => new BCPoint({
                BC: row.bcCd / 10000,
                V: UNew.MPS(row.mv / 10),
            })),
            dragTable: profile.bcType === "G7" ? DragTables.G7 : DragTables.G1,
            ...bulletProps,
        });
    } else {
        dm = new DragModel({
            bc: 1,
            dragTable: dragTable as any,
            ...bulletProps,
        });
    }

    let zeroAmmo = new Ammo({
        dm: dm,
        tempModifier: profile.cTCoeff / 100,
        mv: UNew.MPS(profile.cMuzzleVelocity),
        powderTemp: UNew.Celsius(profile.cZeroTemperature),
        usePowderSensitivity: true,
    });

    let muzzleVelocity = zeroAmmo.mv;

    if (currentConditions.flags.usePowderSens) {
        if (currentConditions.flags.useDifferentPowderTemperature) {
            muzzleVelocity = zeroAmmo.getVelocityForTemp(UNew.Celsius(profile.cZeroPTemperature))
        } else {
            muzzleVelocity = zeroAmmo.getVelocityForTemp(UNew.Celsius(profile.cZeroAirTemperature))
        }
    }

    zeroAmmo = new Ammo({
        dm: dm,
        tempModifier: profile.cTCoeff / 100,
        powderTemp: UNew.Celsius(profile.cZeroTemperature),
        mv: muzzleVelocity,
        usePowderSensitivity: true,
    });

    const zeroShot = new Shot({
        weapon: zeroWeapon,
        ammo: zeroAmmo,
        atmo: zeroAtmo,
        lookAngle: zeroData.lookAngle
    });

    console.log(profile.cMuzzleVelocity)

    try {
        const calc = new Calculator();
        const zeroElevation = await calc.setWeaponZero(zeroShot, zeroData.zeroDistance);
        console.log(`Barrel elevation for ${zeroData.zeroDistance} zero: ${zeroElevation.to(Unit.Degree)}`)
        console.log(`Muzzle velocity at zero temperature ${zeroAtmo.temperature} is ${zeroAmmo.getVelocityForTemp(zeroAtmo.temperature).to(Unit.MPS)}`)
        return { weapon: zeroWeapon, ammo: zeroAmmo, calc: calc, error: null };
    } catch (error) {
        return { weapon: zeroWeapon, ammo: zeroAmmo, calc: new Calculator(), error: error as Error };
    }
};

export const makeShot = async (profile: ProfileProps, calculator: PreparedZeroData, currentConditions: CurrentConditionsType): Promise<HitResult | Error> => {
    console.log(profile.cMuzzleVelocity)

    try {
        const { weapon, ammo, calc } = calculator;

        const shotData = {
            atmo: {
                pressure: currentConditions.pressure.value,
                temperature: currentConditions.temperature.value,
                humidity: currentConditions.humidity,
            },
            wind: {
                velocity: currentConditions.windSpeed.value,
                directionFrom: currentConditions.windDirection.value
            },
            trajectoryProps: {
                trajectoryRange: UNew.Meter(3000 + 1e-9),
                trajectoryStep: UNew.Meter(1),
            },
            lookAngle: currentConditions.lookAngle.value,
        }

        const atmo = new Atmo(shotData.atmo);

        let currentMuzzleVelocity = UNew.MPS(profile.cMuzzleVelocity)

        if (currentConditions.flags.usePowderSens) {
            if (currentConditions.flags.useDifferentPowderTemperature) {
                currentMuzzleVelocity = ammo.getVelocityForTemp(currentConditions.powderTemperature.value)
            } else {
                currentMuzzleVelocity = ammo.getVelocityForTemp(currentConditions.temperature.value)
            }
        }

        const shotAmmo = new Ammo({
            dm: ammo.dm,
            tempModifier: profile.cTCoeff / 100,
            powderTemp: ammo.powderTemp,
            mv: currentMuzzleVelocity,
            usePowderSensitivity: ammo.usePowderSensitivity,
        })
        console.log(shotAmmo.mv)

        const targetShot = new Shot({
            weapon: weapon,
            ammo: shotAmmo,
            atmo: atmo,
            lookAngle: shotData.lookAngle,
            winds: [new Wind(shotData.wind)]
        });

        const hit = await calc.fire({
            shot: targetShot,
            ...shotData.trajectoryProps,
            filterFlags: TrajFlag.ALL,
        });

        return hit;

    } catch (error) {
        return error as Error
    }

}

export const shootTheTarget = async (profile: ProfileProps, calculator: PreparedZeroData, currentConditions: CurrentConditionsType): Promise<HitResult | Error> => {
    console.log(profile.cMuzzleVelocity)

    try {
        const { weapon, ammo, calc } = calculator;
        console.log(currentConditions)

        const shotData = {
            atmo: {
                pressure: currentConditions.pressure.value,
                temperature: currentConditions.temperature.value,
                humidity: currentConditions.humidity,
            },
            wind: {
                velocity: currentConditions.windSpeed.value,
                directionFrom: currentConditions.windDirection.value
            },
            trajectoryProps: {
                trajectoryRange: UNew.Meter(currentConditions.targetDistance.value.In(Unit.Meter) + 200),
                trajectoryStep: UNew.Meter(1),
            },
            lookAngle: currentConditions.lookAngle.value,
            targetDistance: currentConditions.targetDistance.value
        }

        let currentMuzzleVelocity = UNew.MPS(profile.cMuzzleVelocity)

        if (currentConditions.flags.usePowderSens) {
            if (currentConditions.flags.useDifferentPowderTemperature) {
                currentMuzzleVelocity = ammo.getVelocityForTemp(currentConditions.powderTemperature.value)
            } else {
                currentMuzzleVelocity = ammo.getVelocityForTemp(currentConditions.temperature.value)
            }
        }

        const shotAmmo = new Ammo({
            dm: ammo.dm,
            tempModifier: profile.cTCoeff / 100,
            powderTemp: ammo.powderTemp,
            mv: currentMuzzleVelocity,
            usePowderSensitivity: ammo.usePowderSensitivity,
        })

        const newShot = new Shot({
            weapon: weapon,
            ammo: shotAmmo,
            atmo: new Atmo(shotData.atmo),
            winds: [new Wind(shotData.wind)],
            lookAngle: shotData.lookAngle
        })

        const newElevation = await calc.barrelElevationForTarget(newShot, shotData.targetDistance)
        const hold = UNew.MIL(newElevation.In(Unit.MIL) - weapon.zeroElevation.In(Unit.MIL))
        console.log(`Elevalion: ${newElevation.to(Unit.MIL)} at ${shotData.targetDistance.to(Unit.Meter)}`)
        console.log(`Hold: ${hold.to(Unit.MIL)} at ${shotData.targetDistance.to(Unit.Meter)}`)
        newShot.relativeAngle = hold
        const adjustedHit = await calc.fire({ shot: newShot, ...shotData.trajectoryProps, filterFlags: TrajFlag.ALL })
        return adjustedHit
    } catch (error) {
        return error as Error
    }
}
