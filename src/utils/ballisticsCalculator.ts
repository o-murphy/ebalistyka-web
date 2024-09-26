import Calculator, {
    Ammo, Atmo, BCPoint, DragModelMultiBC, Shot, UNew, Weapon, Table as DragTable,
    DragDataPoint,
    DragModel,
    HitResult,
    Wind

} from 'js-ballistics/dist/v2';
import { ProfileProps } from './parseA7P';

export interface PreparedZeroData {
    weapon: Weapon;
    ammo: Ammo;
    calc: Calculator;
    error: Error|null;
}

export interface CurrentConditions {
    temperature: number;
    pressure: number;
    humidity: number;
    windSpeed: number;
    windDirection: number;
    lookAngle: number;
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

export const prepareCalculator = (profile: ProfileProps): PreparedZeroData => {
    try {


        const zeroData = {
            atmo: {
                pressure: UNew.hPa(profile.cZeroAirPressure / 10),
                temperature: UNew.Celsius(profile.cZeroAirTemperature),
                humidity: profile.cZeroAirHumidity,
            },
            weapon: {
                sightHeight: UNew.Millimeter(profile.scHeight),
                twist: UNew.Inch(profile.rTwist / 100 * (profile.twistDir === "RIGHT" ? 1 : -1)),
                zeroElevation: UNew.Degree(profile.cZeroWPitch),
            },
            ammo: {
                mv: UNew.MPS(profile.cMuzzleVelocity / 10),
                powderTemp: UNew.Celsius(profile.cZeroPTemperature),
                tempModifier: profile.cTCoeff / 1000,
            },
            lookAngle: UNew.Degree(profile.cZeroWPitch / 10)
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

        const ammo = new Ammo({
            dm: dm,
            ...zeroData.ammo
        });

        const zeroShot = new Shot({
            weapon: weapon,
            ammo: ammo,
            atmo: atmo,
            lookAngle: zeroData.lookAngle
        });

        const calc = new Calculator();
        calc.setWeaponZero(zeroShot, UNew.Meter(profile.distances[profile.cZeroDistanceIdx] / 100));

        return { weapon: weapon, ammo: ammo, calc: calc, error: null };

    } catch (error) {
        return { weapon: null, ammo: null, calc: null, error: error }
    }
};

export const makeShot = (calculator: PreparedZeroData, currentConditions: CurrentConditions): HitResult | Error => {

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
                trajectoryRange: UNew.Meter(2001),
                trajectoryStep: UNew.Meter(100),
            },
            lookAngle: UNew.Degree(currentConditions.lookAngle / 10)
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
            ...shotData.trajectoryProps
        });

        return hit;

    } catch (error) {
        return error
    }

}