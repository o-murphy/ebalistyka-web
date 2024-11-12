import { PaperProvider } from "react-native-paper";
import { useThemeSwitch } from "../../context/themeContext";

import React from 'react';
import RootScreenManager from "./RootScreenManager";


const MainScreen = () => {

    const { theme } = useThemeSwitch();

    return (
        <PaperProvider theme={theme}>
            <RootScreenManager />
        </PaperProvider>
    );
};


// import { StyleSheet, View, Text, Dimensions } from "react-native";

// const TILE_BASE_SIZE = 150; // Base size for a 1x1 tile
// const screenWidth = Dimensions.get('window').width;

// const MainScreen = () => {

//     const tiles = [
//         { id: 1, title: '1x1', width: 1, height: 1 },
//         { id: 2, title: '1x2', width: 1, height: 2 },
//         { id: 3, title: '2x1', width: 2, height: 1 },
//         { id: 4, title: '2x2', width: 2, height: 2 },
//         { id: 5, title: '1x1', width: 1, height: 1 },
//         { id: 6, title: '1x1', width: 1, height: 1 },
//       ];
    
//       const tileSize = screenWidth / Math.floor(screenWidth / TILE_BASE_SIZE);
    
//       return (
//         <View style={styles.container}>
//           {tiles.map((tile) => (
//             <View
//               key={tile.id}
//               style={[
//                 styles.tile,
//                 {
//                   width: tile.width * tileSize,
//                   height: tile.height * tileSize,
//                 },
//               ]}
//             >
//               <Text style={styles.text}>{tile.title}</Text>
//             </View>
//           ))}
//         </View>
//       );

//     // const { theme } = useThemeSwitch();

//     // return (
//     //     <PaperProvider theme={theme}>
//     //         <RootScreenManager />
//     //     </PaperProvider>
//     // );
// };

// const styles = StyleSheet.create({
//     container: {
//       flexDirection: 'row',
//       flexWrap: 'wrap',
//     },
//     tile: {
//       backgroundColor: '#4caf50',
//       margin: 2, // Small spacing between tiles
//       justifyContent: 'center',
//       alignItems: 'center',
//     },
//     text: {
//       color: '#fff',
//       fontWeight: 'bold',
//     },
//   });


export default MainScreen;
