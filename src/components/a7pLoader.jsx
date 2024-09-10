import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Table, Row } from 'react-native-table-component';

import CryptoJS from 'crypto-js'; // Import CryptoJS for MD5 checksum
import protobuf from 'protobufjs'; // Import protobufjs

import Calculator, { 
  preferredUnits, Unit, Ammo, Atmo, BCPoint, DragModelMultiBC, Shot, UNew, Weapon, Table as DragTable,
  setGlobalUsePowderSensitivity

} from 'js-ballistics/dist/v2';

import AceEditor from "react-ace";

// import "ace-builds/src-noconflict/mode-java";
// import "ace-builds/src-noconflict/theme-github";
// import "ace-builds/src-noconflict/ext-language_tools";


const PROTO_URL = '/src/proto/profedit.proto'; // Adjust the path to your .proto file
const EXAMPLE_A7P = '/assets/example.a7p'
preferredUnits.distance = Unit.Meter
preferredUnits.velocity = Unit.MPS
preferredUnits.angular = Unit.Degree
preferredUnits.adjustment = Unit.MIL
preferredUnits.drop = Unit.Centimeter

const MD5_LENGTH = 32; // MD5 checksum is 16 bytes (128 bits)

export default function FileLoader() {
  const [fileContent, setFileContent] = useState(null);
  const [isChecksumValid, setIsChecksumValid] = useState(null);

  useEffect(() => {
    async function fetchBinaryFile() {
      try {
        // URL to the file in the public directory
        const response = await fetch(EXAMPLE_A7P);
        const arrayBuffer = await response.arrayBuffer();
        // Convert ArrayBuffer to Base64
        const base64 = bufferToBase64(arrayBuffer);

        // Extract the binary data and checksum
        const binaryData = atob(base64); // Decode Base64 to binary string
        const md5Checksum = binaryData.slice(0, MD5_LENGTH); // Extract the MD5 checksum
        const actualData = binaryData.slice(MD5_LENGTH); // Extract the actual data

        // Calculate the MD5 checksum of the actual data
        const calculatedChecksum = md5(actualData);

        // Verify the checksum
        const isValid = md5Checksum === calculatedChecksum;
        setIsChecksumValid(isValid);

        const root = await protobuf.load(PROTO_URL); // Load .proto file

        const Payload = root.lookupType('profedit.Payload'); // Replace with your actual message type

        if (isValid) {
          // Deserialize the Protobuf message
          try {
            // Ensure actualData is in the correct format
            const uint8ArrayData = new Uint8Array(actualData.split('').map(char => char.charCodeAt(0)));
            const payload = Payload.decode(uint8ArrayData);
            // console.log(payload)
            // setFileContent(payload);
            const payloadObject = Payload.toObject(payload, {
              longs: Number,
              enums: String,
              bytes: String,
              defaults: true,
              arrays: true
            });
            setFileContent(payloadObject.profile);
            console.log('Decoded payload:', payloadObject.profile);
          } catch (error) {
            console.error('Error decoding payload:', error);
          }
        } else {
          console.error('Checksum is invalid');
        }

        // if (isValid) {
        //   // Deserialize the Protobuf message
        //   const payload = ArcherProtocol.HostProfile.deserializeBinary(new Uint8Array(actualData));
        //   setFileContent(payload);
        //   console.log(payload.toObject())
        // } else {
        //   console.error('Checksum is invalid');
        // }

      } catch (error) {
        console.error('Error fetching or processing binary file:', error);
      }
    }

    fetchBinaryFile();
  }, []);

  const bufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const md5 = (data) => {
    // Convert binary string to WordArray for CryptoJS
    const wordArray = CryptoJS.enc.Latin1.parse(data);
    // Calculate MD5 hash and return as hexadecimal string
    const hash = CryptoJS.MD5(wordArray);
    return hash.toString(CryptoJS.enc.Hex);
  };

  const prepareProfile = (profile) => {
    const atmo = Atmo.icao({})
    const weapon = new Weapon({
      sightHeight: UNew.Millimeter(profile.scHeight),
      twist: UNew.Inch(profile.rTwist / 100),
      zeroElevation: UNew.Degree(profile.cZeroWPitch)
    })
    const dm = DragModelMultiBC({
      bcPoints: profile.coefRows.map(row => {
        return new BCPoint({
          BC: row.bcCd / 10000,
          V: UNew.MPS(row.mv / 10) // Assuming `mv` is velocity in feet per second
        });
      }),
      dragTable: profile.bcType === "G7" ? DragTable.G7 : (profile.bcType === "G1" ? DragTable.G1 : null),
      weight: UNew.Grain(profile.bWeight / 10),
      diameter: UNew.Inch(profile.bDiameter / 1000),
      length: UNew.Inch(profile.bLength / 1000)
    })
    const ammo = new Ammo({
      dm: dm,
      mv: UNew.MPS(profile.cMuzzleVelocity / 10),
      powderTemp: UNew.Celsius(profile.cZeroPTemperature),
      tempModifier: profile.cTCoeff / 1000
    })
    console.log(ammo)

    const zeroShot = new Shot({
      weapon: weapon, ammo: ammo, atmo: atmo,
    })

    const calc = new Calculator()
    calc.setWeaponZero(zeroShot, UNew.Meter(profile.distances[profile.cZeroDistanceIdx] / 100))

    const targetShot = new Shot({
      weapon: weapon, ammo: ammo, atmo: atmo
    })
    const hit = calc.fire({
      shot: targetShot,
      trajectoryRange: UNew.Meter(1001),
      trajectoryStep: UNew.Meter(100)
    })

    const result = hit.trajectory.map((row) => {
      console.log(row.inDefUnits())
      return row.formatted()
    })
    return result
  }

  fileContent ? prepareProfile(fileContent) : null

  const headers = [
    'time',
    'distance',
    'velocity',
    'mach',
    'height',
    'targetDrop',
    'dropAdjustment',
    'windage',
    'windageAdjustment',
    'lookDistance',
    'angle',
    'densityFactor',
    'drag',
    'energy',
    'ogw',
    'flag',
  ]

  return (
    <View style={styles.container}>
      {/* <Text>{isChecksumValid === null ? 'Processing...' : isChecksumValid ? 'File read successfully' : 'Checksum is invalid'}</Text> */}
      {/* <Text>Weapon: {fileContent ? JSON.stringify(prepareProfile(fileContent), null, 2) : null}</Text> */}
      <Table borderStyle={{ borderColor: '#c8e1ff', borderWidth: 1 }}>
        <Row data={headers} style={{ height: 40, backgroundColor: '#f1f8ff' }} textStyle={{ textAlign: 'center' }} />
        {fileContent ? prepareProfile(fileContent).map((rowData, index) => (
          // <Row key={index} data={rowData.map(value => value.toFixed(2))} textStyle={{ textAlign: 'center' }} />
          <Row key={index} data={rowData.map(value => value)} textStyle={{ textAlign: 'center' }} />
        )): []}
      </Table>
      {/* <AceEditor
        mode="json"
        onChange={() => { }}
        name="UNIQUE_ID_OF_DIV"
        editorProps={{ $blockScrolling: true }}
        value={JSON.stringify(fileContent, null, 2)}
      />, */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
