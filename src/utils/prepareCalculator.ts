import Calculator, {
    Ammo, Atmo, BCPoint, DragModelMultiBC, Shot, UNew, Weapon, Table as DragTable,
    DragDataPoint,
    DragModel

} from 'js-ballistics/dist/v2';
import { ProfileProps } from './parseA7P';

export const prepareCalculator = (profile: ProfileProps) => {
    console.log(profile)
    const zeroAtmo = new Atmo({
        pressure: UNew.hPa(profile.cZeroAirPressure / 10),
        temperature: UNew.Celsius(profile.cZeroAirTemperature),
        humidity: profile.cZeroAirHumidity,
    });
    const weapon = new Weapon({
        sightHeight: UNew.Millimeter(profile.scHeight),
        twist: UNew.Inch(profile.rTwist / 100),
        zeroElevation: UNew.Degree(profile.cZeroWPitch),
    });

    const dragModel = (profile) => {
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
        mv: UNew.MPS(profile.cMuzzleVelocity / 10),
        powderTemp: UNew.Celsius(profile.cZeroPTemperature),
        tempModifier: profile.cTCoeff / 1000,
    });

    const zeroShot = new Shot({
        weapon: weapon,
        ammo: ammo,
        atmo: zeroAtmo,
    });

    const calc = new Calculator();
    calc.setWeaponZero(zeroShot, UNew.Meter(profile.distances[profile.cZeroDistanceIdx] / 100));

    return { weapon, ammo, calc };
};