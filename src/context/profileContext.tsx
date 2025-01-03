import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import parseA7P, { ProfileProps } from '../utils/parseA7P';
import { DimensionProps, NumeralProps, useDimension, useNumeral, numerals, dimensions } from '../hooks';


export interface ProfileContextType {
  profileProperties: ProfileProps | null;
  fetchBinaryFile: (file: string) => Promise<void>;
  updateProfileProperties: (props: Partial<ProfileProps>) => void;
  isLoaded: boolean;
  setIsLoaded: (loaded: boolean) => void;

  scHeight: DimensionProps;
  rTwist: DimensionProps;
  cZeroWPitch: DimensionProps;
  zeroDistance: DimensionProps;
  cMuzzleVelocity: DimensionProps;
  cZeroTemperature: DimensionProps;
  cTCoeff: NumeralProps;

  bDiameter: DimensionProps;
  bLength: DimensionProps;
  bWeight: DimensionProps;

  cZeroAirTemperature: DimensionProps;
  cZeroAirPressure: DimensionProps;
  cZeroAirHumidity: NumeralProps;
  cZeroPTemperature: DimensionProps;
}


export const ProfileContext = createContext<ProfileContextType | null>(null);


export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profileProperties, setProfileProperties] = useState<ProfileProps | null>(null);
  const [isLoaded, setIsLoaded] = useState(false); // Track loading state

  const scHeight = useDimension(dimensions.scHeight)
  const rTwist = useDimension(dimensions.rTwist)
  const cZeroWPitch = useDimension(dimensions.cZeroWPitch)
  const zeroDistance = useDimension(dimensions.zeroDistance)

  const cMuzzleVelocity = useDimension(dimensions.cMuzzleVelocity)
  const cZeroTemperature = useDimension(dimensions.cZeroPTemperature)

  const cTCoeff = useNumeral(numerals.cTCoeff)

  const bDiameter = useDimension(dimensions.bDiameter)
  const bLength = useDimension(dimensions.bLength)
  const bWeight = useDimension(dimensions.bWeight)

  const cZeroAirTemperature = useDimension(dimensions.temperature)
  const cZeroAirPressure = useDimension(dimensions.pressure)
  const cZeroAirHumidity = useNumeral(numerals.humidity)
  const cZeroPTemperature = useDimension(dimensions.temperature)

  const setParsedProps = (props: ProfileProps) => {
    setProfileProperties(props)
    scHeight.setAsDef(props.scHeight ?? 2)
    rTwist.setAsDef((props.rTwist ?? 10) / 100)
    cZeroWPitch.setAsDef(props?.cZeroWPitch ?? 10)
    // zeroDistance.setAsDef(((props?.zeroDistance || props.distances[props.cZeroDistanceIdx]) ?? 10000) / 100)
    zeroDistance.setAsDef(props?.zeroDistance || 100)

    cMuzzleVelocity.setAsDef((props.cMuzzleVelocity ?? 8000) / 10)
    cZeroTemperature.setAsDef(props.cZeroTemperature ?? 15)
    cTCoeff.setValue((props.cTCoeff ?? 1000) / 1000)

    bDiameter.setAsDef((props.bDiameter ?? 338) / 1000)
    bLength.setAsDef((props.bLength ?? 1.8) / 1000)
    bWeight.setAsDef((props.bWeight ?? 300) / 10)

    cZeroAirTemperature.setAsDef(props.cZeroAirTemperature ?? 15)
    cZeroAirPressure.setAsDef((props.cZeroAirPressure ?? 10000) / 10)
    cZeroAirHumidity.setValue(props.cZeroAirHumidity ?? 50)
    cZeroPTemperature.setValue(props.cZeroPTemperature ?? 50)
  }

  useEffect(() => {
    const load = async () => {
      const profileValue = await AsyncStorage.getItem('profileProperties')
      const profileValueParsed: ProfileProps = JSON.parse(profileValue ?? defaultProfile)
      if (profileValue !== null && profileValue !== 'null') {

        updateProfileProperties(profileValueParsed)

        setIsLoaded(true)
        console.log("loaded profile cache")
      }
    };
    load();
  }, []);

  useEffect(() => {
    const save = async (profileProperties) => {
      try {
        const jsonValue = JSON.stringify({
          ...profileProperties,
          rTwist: rTwist.asDef * 100,
          scHeight: scHeight.asDef,
          cZeroWPitch: cZeroWPitch.asDef,
          zeroDistance: zeroDistance.asDef,
          cMuzzleVelocity: cMuzzleVelocity.asDef * 10,
          cZeroTemperature: cZeroTemperature.asDef,
          cTCoeff: cTCoeff.value * 1000,
          bDiameter: bDiameter.asDef * 1000,
          bLength: bLength.asDef * 1000,
          bWeight: bWeight.asDef * 10,
          cZeroAirHumidity: cZeroAirHumidity.value,
          cZeroAirTemperature: cZeroAirTemperature.asDef,
          cZeroAirPressure: cZeroAirPressure.asDef * 10,
          cZeroPTemperature: cZeroPTemperature.asDef,
        });
        await AsyncStorage.setItem('profileProperties', jsonValue);
      } catch (error) {
        console.error('Failed to cache profile:', error);
      }
    };
    save(profileProperties);
  }, [
    profileProperties,
    scHeight,
    rTwist
  ]);

  const fetchBinaryFile = async (file: string) => {
    try {
      const response = await fetch(file);
      const arrayBuffer = await response.arrayBuffer();

      parseA7P(arrayBuffer)
        .then(parsedData => {
          updateProfileProperties(parsedData);
        })
        .catch(error => {
          console.error('Error parsing A7P file:', error);
        });
    } catch (error) {
      console.error('Error fetching or processing binary file:', error);
    }
  };

  const updateProfileProperties = (props: Partial<ProfileProps>) => {
    setParsedProps({ ...profileProperties, ...props });
    // setParsedProps((prev) => ({ ...prev, ...props }))
  };

  return (
    <ProfileContext.Provider value={{
      profileProperties,
      fetchBinaryFile,
      updateProfileProperties,
      isLoaded,
      setIsLoaded,
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
    }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

const defaultProfile = '{"switches":[{"cIdx":255,"reticleIdx":0,"zoom":1,"distance":10000,"distanceFrom":"VALUE"},{"cIdx":255,"reticleIdx":0,"zoom":2,"distance":20000,"distanceFrom":"VALUE"},{"cIdx":255,"reticleIdx":0,"zoom":3,"distance":30000,"distanceFrom":"VALUE"},{"cIdx":255,"reticleIdx":0,"zoom":4,"distance":100000,"distanceFrom":"VALUE"}],"distances":[10000,20000,25000,30000,35000,40000,42000,44000,46000,48000,50000,52000,54000,56000,58000,60000,61000,62000,63000,64000,65000,66000,67000,68000,69000,70000,71000,72000,73000,74000,75000,76000,77000,78000,79000,80000,81000,82000,83000,84000,85000,86000,87000,88000,89000,90000,91000,92000,93000,94000,95000,96000,97000,98000,99000,100000,100500,101000,101500,102000,102500,103000,103500,104000,104500,105000,105500,106000,106500,107000,107500,108000,108500,109000,109500,110000,110500,111000,111500,112000,112500,113000,113500,114000,114500,115000,115500,116000,116500,117000,117500,118000,118500,119000,119500,120000,120500,121000,121500,122000,122500,123000,123500,124000,124500,125000,125500,126000,126500,127000,127500,128000,128500,129000,129500,130000,130500,131000,131500,132000,132500,133000,133500,134000,134500,135000,135500,136000,136500,137000,137500,138000,138500,139000,139500,140000,140500,141000,141500,142000,142500,143000,143500,144000,144500,145000,145500,146000,146500,147000,147500,148000,148500,149000,149500,150000,150500,151000,151500,152000,152500,153000,153500,154000,154500,155000,155500,156000,156500,157000,157500,158000,158500,159000,159500,160000,160500,161000,161500,162000,162500,163000,163500,164000,164500,165000,165500,166000,166500,167000,167500,168000,168500,169000,169500,170000],"coefRows":[{"bcCd":3820,"mv":9110},{"bcCd":3810,"mv":8330},{"bcCd":3720,"mv":7590},{"bcCd":3740,"mv":6090},{"bcCd":3870,"mv":4560}],"profileName":"338LM","cartridgeName":"UKROP 300GR SMK","bulletName":"UKROP 300GR SMK","shortNameTop":"338LM","shortNameBot":"300gr","userNote":"\n","zeroX":0,"zeroY":0,"scHeight":90,"rTwist":900,"cMuzzleVelocity":8050,"cZeroTemperature":15,"cTCoeff":1230,"cZeroDistanceIdx":0,"cZeroAirTemperature":15,"cZeroAirPressure":10000,"cZeroAirHumidity":50,"cZeroWPitch":0,"cZeroPTemperature":15,"bDiameter":338,"bWeight":3000,"bLength":1800,"twistDir":"RIGHT","bcType":"G7","caliber":".338 Lapua Magnum","deviceUuid":""}'
  .replace(/[\u0000-\u001F]/g, '')
