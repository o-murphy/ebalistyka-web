import Calculator, {
    Ammo, Atmo, BCPoint, DragModelMultiBC, Shot, UNew, Weapon, Table as DragTable,
    DragDataPoint,
    DragModel,
    HitResult,
    Wind,
    getGlobalUsePowderSensitivity,
    setGlobalUsePowderSensitivity
} from 'js-ballistics/dist/v2';
import { ProfileProps } from './parseA7P';
import { Unit } from 'js-ballistics';

export interface PreparedZeroData {
    weapon: Weapon;
    ammo: Ammo;
    calc: Calculator;
    error: Error | null;
}

export interface CurrentConditionsProps {
    temperature: number;
    pressure: number;
    humidity: number;
    windSpeed: number;
    windDirection: number;
    lookAngle: number;

    targetDistance: number,
    trajectoryStep: number,
    trajectoryRange: number,

    usePowderSens: boolean,
    useDifferentPowderTemperature: boolean,
    powderTemperature: number,
}

// Handle messages from the main thread
// self.onmessage = async (event) => {
//     const { currentCalc, currentConditions } = event.data;
  
//     try {
//       // Perform your calculations here (this should be asynchronous)
//       const result = await makeShot(currentCalc, currentConditions);
//       const adjustedResult = await shootTheTarget(currentCalc, currentConditions);
  
//       // Post the results back to the main thread
//       self.postMessage({ result, adjustedResult });
//     } catch (error) {
//       self.postMessage({ error: error.message });
//     }
// };

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

export const prepareCalculator = (profile: ProfileProps, currentConditions): PreparedZeroData => {

        const zeroData = {
            atmo: {
                pressure: UNew.hPa(profile.cZeroAirPressure / 10),
                temperature: UNew.Celsius(profile.cZeroAirTemperature),
                humidity: profile.cZeroAirHumidity,
            },
            weapon: {
                sightHeight: UNew.Millimeter(profile.scHeight),
                twist: UNew.Inch(profile.rTwist / 100 * (profile.twistDir === "RIGHT" ? 1 : -1)),
                // zeroElevation: UNew.Degree(profile.cZeroWPitch),
            },
            ammo: {
                mv: UNew.MPS(profile.cMuzzleVelocity / 10),
                powderTemp: UNew.Celsius(profile.cZeroPTemperature),
                tempModifier: profile.cTCoeff / 1000 / 100,  // NOTE:  / 100 REQUIRED
            },
            lookAngle: UNew.Degree(profile.cZeroWPitch / 10),
            zeroDistance: UNew.Meter(profile.distances[profile.cZeroDistanceIdx] / 100)
        }

        const atmo = new Atmo(zeroData.atmo);
        const weapon = new Weapon(zeroData.weapon);

        const { dragTable, bcPoints } = dragModel(profile);
        const bulletProps = {
            weight: UNew.Grain(profile.bWeight / 10),
            diameter: UNew.Inch(profile.bDiameter / 1000),
            length: UNew.Inch(profile.bLength / 1000),
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

        let ammo = new Ammo({
            dm: dm,
            ...zeroData.ammo
        });

        if (getGlobalUsePowderSensitivity() && currentConditions.useDifferentPowderTemperature) {
            console.log("Adjusting mv to powder temp")
            setGlobalUsePowderSensitivity(false)
            ammo = new Ammo({
                dm: dm,
                ...{...zeroData.ammo, mv: ammo.getVelocityForTemp(UNew.Celsius(currentConditions.powderTemperature))}
            });
        }

        const zeroShot = new Shot({
            weapon: weapon,
            ammo: ammo,
            atmo: atmo,
            lookAngle: zeroData.lookAngle
        });

        const calc = new Calculator();
        const zeroElevation = calc.setWeaponZero(zeroShot, zeroData.zeroDistance);
        console.log(`Barrel elevation for ${zeroData.zeroDistance} zero: ${zeroElevation.to(Unit.Degree)}`)
        console.log(`Muzzle velocity at zero temperature ${atmo.temperature} is ${ammo.getVelocityForTemp(atmo.temperature).to(Unit.MPS)}`)
        return { weapon: weapon, ammo: ammo, calc: calc, error: null };

};

export const makeShot = (calculator: PreparedZeroData, currentConditions: CurrentConditionsProps): HitResult | Error => {

    try {

        const { weapon, ammo, calc } = calculator;

        const shotData = {
            atmo: {
                pressure: UNew.hPa(currentConditions.pressure),
                temperature: UNew.Celsius(currentConditions.temperature),
                humidity: currentConditions.humidity,
            },
            wind: {
                velocity: UNew.MPS(currentConditions.windSpeed),
                directionFrom: UNew.Degree(currentConditions.windDirection)
            },
            trajectoryProps: {
                trajectoryRange: UNew.Meter(3000 + 1e-9),
                trajectoryStep: UNew.Meter(currentConditions.trajectoryStep),
            },
            lookAngle: UNew.Degree(currentConditions.lookAngle / 10),
        }

        const atmo = new Atmo(shotData.atmo);

        const targetShot = new Shot({
            weapon: weapon,
            ammo: ammo,
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

export const shootTheTarget = (calculator: PreparedZeroData, currentConditions: CurrentConditionsProps): HitResult | Error => {

    try {
        const { weapon, ammo, calc } = calculator;

        const shotData = {
            atmo: {
                pressure: UNew.hPa(currentConditions.pressure),
                temperature: UNew.Celsius(currentConditions.temperature),
                humidity: currentConditions.humidity,
            },
            wind: {
                velocity: UNew.MPS(currentConditions.windSpeed),
                directionFrom: UNew.Degree(currentConditions.windDirection)
            },
            trajectoryProps: {
                trajectoryRange: UNew.Meter(currentConditions.targetDistance + 2 * currentConditions.trajectoryStep),
                trajectoryStep: UNew.Meter(currentConditions.trajectoryStep),
                
            },
            lookAngle: UNew.Degree(currentConditions.lookAngle / 10),
            targetDistance: UNew.Meter(currentConditions.targetDistance)
        }

        const newShot = new Shot({
            weapon: weapon,
            ammo: ammo,
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
        const adjustedHit = calc.fire({shot: newShot, ...shotData.trajectoryProps, extraData: true})
        return adjustedHit
    } catch (error) {
        return error
    }
}