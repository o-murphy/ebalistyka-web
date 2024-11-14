import bufferToBase64 from "./bufferToBase64";
import md5 from "./md5";
import protobuf from 'protobufjs';

const PROTO_URL = __DEV__ ? '/public/proto/profedit.proto' : '/ebalistyka-web/proto/profedit.proto';
const MD5_LENGTH = 32;

export interface ProfileProps {
    bDiameter: number;
    bLength: number;
    bWeight: number;
    bcType: string;
    bulletName: string;
    cMuzzleVelocity: number;
    cTCoeff: number;
    cZeroAirHumidity: number;
    cZeroAirPressure: number;
    cZeroAirTemperature: number;
    cZeroDistanceIdx: number;
    cZeroPTemperature: number;
    cZeroTemperature: number;
    cZeroWPitch: number;
    caliber: string;
    cartridgeName: string;
    coefRows: any[];
    deviceUuid: string;
    distances: number[];
    profileName: string;
    rTwist: number;
    scHeight: number;
    shortNameBot: string;
    shortNameTop: string;
    switches: any[];
    twistDir: string;
    userNote: string;
    zeroX: number;
    zeroY: number;

    zeroDistance?: number;
}

export default async function parseA7P(arrayBuffer: any) {
    const base64 = bufferToBase64(arrayBuffer);
    const binaryData = atob(base64);
    const md5Checksum = binaryData.slice(0, MD5_LENGTH);
    const actualData = binaryData.slice(MD5_LENGTH);

    const calculatedChecksum = md5(actualData);

    if (!md5Checksum === calculatedChecksum) {
        console.error("Invalid A7P file checksum")
        throw new Error("Invalid A7P file checksum")
    }

    const root = await protobuf.load(PROTO_URL);
    const Payload = root.lookupType('profedit.Payload');

    try {
        const uint8ArrayData = new Uint8Array(actualData.split('').map(char => char.charCodeAt(0)));
        const payload = Payload.decode(uint8ArrayData);
        const payloadObject = Payload.toObject(payload, {
            longs: Number,
            enums: String,
            bytes: String,
            defaults: true,
            arrays: true
        });
        const profile: ProfileProps = payloadObject.profile
        return profile
    } catch (error) {
        console.error(error)
        throw new Error('Error decoding payload:', error);
    }

};