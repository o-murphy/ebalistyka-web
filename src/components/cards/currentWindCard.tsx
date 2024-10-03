import React, { useEffect, useRef, useState } from "react";
import CustomCard from "./customCard";
import WindDirectionPicker from "../widgets/windDirectionPicker";
import { CalculationState, useCalculator } from "../../context/profileContext";
import { WindSpeedField } from "../widgets/measureFields";
import { View } from "react-native";
import { FAB, Icon, Tooltip } from "react-native-paper";
import { Unit, UnitProps } from "js-ballistics/dist/v2";

interface WindCardProps {
    label?: string;
    expanded?: boolean;
}

const CurrentWindCard: React.FC<WindCardProps> = ({ label = "Zero wind direction and speed", expanded = true }) => {
    const { currentConditions, updateCurrentConditions, calcState, fire } = useCalculator();
    const [windDir, setWindDir] = useState(currentConditions.windDirection);
    const [isHovered, setIsHovered] = useState(false);
    const [refreshable, setRefreshable] = useState(false);
    const initialWindDir = useRef(currentConditions.windDirection);

    useEffect(() => {
        if (currentConditions.windDirection !== initialWindDir.current) {
            console.log("Setting wind direction from current conditions:", currentConditions.windDirection);
            setWindDir(currentConditions.windDirection);
            initialWindDir.current = currentConditions.windDirection;
        }
    }, [currentConditions.windDirection]);

    useEffect(() => {
        if (calcState === CalculationState.Complete) {
            setRefreshable(false);
        }
    }, [calcState]);

    const handleWindDirChange = (value) => {
        if (value !== windDir) {
            setWindDir(value);
        }
    };

    const handleMouseUp = () => {
        // Update current conditions when mouse button is released
        updateCurrentConditions({ windDirection: windDir });
        setRefreshable(true);
        console.log("Updated wind direction on mouse up:", windDir);
    };

    return (
        <CustomCard title={label} expanded={expanded}>
            <WindSpeedField />
            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                {(!isHovered && refreshable) && (
                    <Tooltip title="Recalculate" enterTouchDelay={0} leaveTouchDelay={0}>
                        <FAB
                            visible={refreshable}
                            style={{ marginVertical: 4, marginRight: 4 }}
                            size={"small"}
                            icon={"reload"}
                            onPress={() => fire()}
                            variant="tertiary"
                        />
                    </Tooltip>
                )}
                <View
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onMouseUp={handleMouseUp}
                >
                    {!isHovered ? (
                        <FAB
                            icon={() => (
                                <View style={{ transform: [{ rotate: `${180 + windDir * 30}deg` }] }}>
                                    <Icon size={20} source={"navigation"} />
                                </View>
                            )}
                            size="small"
                            variant="surface"
                            label={`Wind from: ${windDir * 30}${UnitProps[Unit.Degree].symbol}`}
                            animated={false}
                        />
                    ) : (
                        <WindDirectionPicker
                            value={windDir}
                            onChange={handleWindDirChange}
                            // onMouseUp={handleMouseUp} // Add onMouseUp event
                        />
                    )}
                </View>
            </View>
        </CustomCard>
    );
};

export default CurrentWindCard;


// import React, { useEffect, useRef, useState } from "react";
// import CustomCard from "./customCard";
// import WindDirectionPicker from "../widgets/windDirectionPicker";
// import { CalculationState, useCalculator } from "../../context/profileContext";
// import { WindSpeedField } from "../widgets/measureFields";
// import { View } from "react-native";
// import { FAB, Icon, Tooltip } from "react-native-paper";
// import { Unit, UnitProps } from "js-ballistics/dist/v2";


// interface WindCardProps {
//     label?: string;
//     expanded?: boolean;
// }

// const CurrentWindCard: React.FC<WindCardProps> = ({ label = "Zero wind direction and speed", expanded = true }) => {

//     const { currentConditions, updateCurrentConditions, calcState, fire } = useCalculator();
//     const [windDir, setWindDir] = useState(currentConditions.windDirection);
//     const [isHovered, setIsHovered] = useState(false);
//     const [refreshable, setRefreshable] = useState(false);
//     const initialWindDir = useRef(currentConditions.windDirection);

//     useEffect(() => {
//         // Only update windDir if it's different from the currentConditions
//         if (currentConditions.windDirection !== initialWindDir.current) {
//             console.log("Setting wind direction from current conditions:", currentConditions.windDirection);
//             setWindDir(currentConditions.windDirection);
//             initialWindDir.current = currentConditions.windDirection;
//         }
//     }, [currentConditions.windDirection]);

//     useEffect(() => {
//         // Update current conditions only if windDir has changed
//         if (windDir !== currentConditions.windDirection) {
//             updateCurrentConditions({ windDirection: windDir });
//             setRefreshable(true);
//             console.log("Updated wind direction:", windDir);
//         }
//     }, [windDir]);

//     useEffect(() => {
//         if (calcState === CalculationState.Complete) {
//             setRefreshable(false);
//         }
//     }, [calcState]);

//     const handleWindDirChange = (value) => {
//         if (value !== windDir) { // Only update if the new value is different
//             setWindDir(value);
//         }
//     };


//     return (
//         <CustomCard title={label} expanded={expanded}>

//             <WindSpeedField />
//             <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
//                 {(!isHovered && refreshable) &&
//                     <Tooltip title="Recalculate" enterTouchDelay={0} leaveTouchDelay={0} >
//                         <FAB
//                             visible={refreshable}
//                             style={{ marginVertical: 4, marginRight: 4 }}
//                             size={"small"}
//                             icon={"reload"}
//                             onPress={() => fire()}
//                             variant="tertiary"
//                         />
//                     </Tooltip>
//                 }
//                 <View
//                     onMouseEnter={() => setIsHovered(true)}
//                     onMouseLeave={() => setIsHovered(false)}
//                 >
//                     {!isHovered ? <FAB
//                         icon={() => <View style={{ transform: [{ rotate: `${180 + windDir * 30}deg` }] }}>
//                             <Icon size={20} source={"navigation"} />
//                         </View>}
//                         size="small"
//                         variant="surface"
//                         label={`Wind from: ${windDir * 30}${UnitProps[Unit.Degree].symbol}`}
//                         animated={false}
//                     /> : <WindDirectionPicker
//                         value={windDir}
//                         onChange={handleWindDirChange }
//                     />}
//                 </View>

//             </View>
//         </CustomCard>
//     );
// };

// export default CurrentWindCard;
