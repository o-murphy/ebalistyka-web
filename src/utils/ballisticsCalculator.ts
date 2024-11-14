import Calculator, {
    Ammo, Atmo, BCPoint, DragModelMultiBC, Shot, UNew, Weapon, Table as DragTable,
    DragDataPoint,
    DragModel,
    HitResult,
    Wind,
    getGlobalUsePowderSensitivity,
    setGlobalUsePowderSensitivity,
    AbstractUnit,
    Temperature,
    Pressure,
    Velocity,
    Angular,
    Distance
} from 'js-ballistics/dist/v2';
import { ProfileProps } from './parseA7P';
import { Unit } from 'js-ballistics';
import { DimensionProps } from '../hooks/dimension';

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
                dragTable: DragTable.G7,
                bcPoints: profile.coefRows.map((row) => new BCPoint({
                    BC: row.bcCd / 10000,
                    V: UNew.MPS(row.mv / 10),
                })),
            };
        case "G1":
            return {
                dragTable: DragTable.G1,
                bcPoints: profile.coefRows.map((row) => new BCPoint({
                    BC: row.bcCd / 10000,
                    V: UNew.MPS(row.mv / 10),
                })),
            };
        default:
            return {
                dragModel: profile.coefRows.map((item) => new DragDataPoint(item.mv, item.bcCd)),
                bcPoints: null,
            };
    }
};

export const prepareCalculator = (profile: ProfileProps, currentConditions: CurrentConditionsType): PreparedZeroData => {

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
            dragTable: profile.bcType === "G7" ? DragTable.G7 : DragTable.G1,
            ...bulletProps,
        });
    } else {
        dm = new DragModel({
            bc: 1,
            dragTable: dragTable,
            ...bulletProps,
        });
    }

    let zeroAmmo = new Ammo({
        dm: dm,
        tempModifier: profile.cTCoeff / 100,
        mv: UNew.MPS(profile.cMuzzleVelocity),
        powderTemp: UNew.Celsius(profile.cZeroTemperature),
    });

    let muzzleVelocity = null;

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
    });

    const zeroShot = new Shot({
        weapon: zeroWeapon,
        ammo: zeroAmmo,
        atmo: zeroAtmo,
        lookAngle: zeroData.lookAngle
    });

    const calc = new Calculator();
    const zeroElevation = calc.setWeaponZero(zeroShot, zeroData.zeroDistance);
    console.log(`Barrel elevation for ${zeroData.zeroDistance} zero: ${zeroElevation.to(Unit.Degree)}`)
    console.log(`Muzzle velocity at zero temperature ${zeroAtmo.temperature} is ${zeroAmmo.getVelocityForTemp(zeroAtmo.temperature).to(Unit.MPS)}`)
    return { weapon: zeroWeapon, ammo: zeroAmmo, calc: calc, error: null };
};

export const makeShot = (profile: ProfileProps, calculator: PreparedZeroData, currentConditions: CurrentConditionsType): HitResult | Error => {

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

        // let shotAmmo = ammo;
        let currentMuzzleVelocity = UNew.MPS(profile.cMuzzleVelocity) //ammo.mv;

        if (currentConditions.flags.usePowderSens) {
            if (currentConditions.flags.useDifferentPowderTemperature) {
                currentMuzzleVelocity = ammo.getVelocityForTemp(currentConditions.powderTemperature.value)
            } else {
                currentMuzzleVelocity = ammo.getVelocityForTemp(currentConditions.temperature.value)
            }
        }

        const shotAmmo = new Ammo({
            ...ammo,
            tempModifier: profile.cTCoeff / 100,
            mv: currentMuzzleVelocity
        })

        const targetShot = new Shot({
            weapon: weapon,
            ammo: shotAmmo,
            atmo: atmo,
            lookAngle: shotData.lookAngle,  // TODO: add look angle 
            winds: [new Wind(shotData.wind)]
        });

        const hit = calc.fire({
            shot: targetShot,
            ...shotData.trajectoryProps,
            extraData: true

        });

        return hit;

    } catch (error) {
        return error
    }

}

export const shootTheTarget = (profile: ProfileProps, calculator: PreparedZeroData, currentConditions: CurrentConditionsType): HitResult | Error => {

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

        // let shotAmmo = ammo;
        let currentMuzzleVelocity = UNew.MPS(profile.cMuzzleVelocity / 10) // ammo.mv;

        if (currentConditions.flags.usePowderSens) {
            if (currentConditions.flags.useDifferentPowderTemperature) {
                currentMuzzleVelocity = ammo.getVelocityForTemp(currentConditions.powderTemperature.value)
            } else {
                currentMuzzleVelocity = ammo.getVelocityForTemp(currentConditions.temperature.value)
            }
        }

        const shotAmmo = new Ammo({
            ...ammo,
            tempModifier: profile.cTCoeff / 1000 / 100,
            mv: currentMuzzleVelocity
        })

        const newShot = new Shot({
            weapon: weapon,
            ammo: shotAmmo,
            atmo: new Atmo(shotData.atmo),
            winds: [new Wind(shotData.wind)],
            lookAngle: shotData.lookAngle
        })

        const newElevation = calc.barrelElevationForTarget(newShot, shotData.targetDistance)
        // const horizontal = UNew.Meter(Math.cos(newShot.lookAngle.In(Unit.Radian)) * shotData.targetDistance.In(Unit.Meter))
        const hold = UNew.MIL(newElevation.In(Unit.MIL) - weapon.zeroElevation.In(Unit.MIL))
        console.log(`Elevalion: ${newElevation.to(Unit.MIL)} at ${shotData.targetDistance.to(Unit.Meter)}`)
        console.log(`Hold: ${hold.to(Unit.MIL)} at ${shotData.targetDistance.to(Unit.Meter)}`)
        newShot.relativeAngle = hold
        const adjustedHit = calc.fire({ shot: newShot, ...shotData.trajectoryProps, extraData: true })
        return adjustedHit
    } catch (error) {
        return error
    }
}