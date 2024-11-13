import { getDeviceTypeAsync, g } from "expo-device";
import { useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";

const useDeviceType = () => {
    const [devType, setDevType] = useState(null)
    // const [isMobile, setIsMobile] = useState(false)

    const windowDimensions = useWindowDimensions()

    useEffect(() => {
      getDeviceTypeAsync().then((deviceType) => {
        setDevType(deviceType);
      });
    }, [windowDimensions]);

    return devType
}

export default useDeviceType;