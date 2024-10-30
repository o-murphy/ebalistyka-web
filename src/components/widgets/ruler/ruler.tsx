import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  View
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Text, TextInput } from 'react-native-paper';


function createArray(min, max, step) {
  const result = [];
  for (let i = min; i <= max; i += step) {
      // Round each value to a fixed number of decimal places
      result.push(Number(i));
  }
  return result;
}


export const TickList = ({children}) => {
  return (
    <View style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      alignItems: "center",
      justifyContent: "center",
    }}>
      {children}
    </View>
  )
}


export const Ruler = ({min, max, step, width, snapTickSize}) => {
  let cur = min;
  
  const ticks = []

  while (cur <= max) {
    ticks.push(<View style={{height: snapTickSize * step}}>
      <View style={{height: 1, width: width, backgroundColor: "#999" }} />
    </View>)
    cur += step;
  }  
  
  return (
    <TickList>
      {ticks}
    </TickList>
  )
}

export const Labels = ({min, max, step, snapTickSize, fraction}) => {
  let cur = min;

  const ticks = []
  // const offset = snapTickSize * (step - min)

  while (cur <= max) {
    console.log(cur)
    ticks.push(<View style={{height: snapTickSize * step }}>
      <Text style={{
        fontSize: snapTickSize * step / 5, 
        textAlign: "center",
        top: - snapTickSize * step / 10,
        backgroundColor: "white", 
        paddingHorizontal: snapTickSize * step / 10
      }} 
      >{cur.toFixed(fraction)}</Text>
    </View>)
    cur += step;
  }  

  return (
    <TickList>
      {ticks}
    </TickList>
  )
}

export const Indicator = ({top}) => {
  return (
    <View style={{
        position: "absolute",
        top: top - 1,
        left: 0,
        right: 0,
        height: 3,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 5,
      }}
    >
      <View style={{height: 3, backgroundColor: "red", width: 10}}/>
      <View style={{height: 3, backgroundColor: "red", width: 10}}/>
    </View>
  );
};

export interface RulerSliderProps {
  minValue?: number;
  maxValue?: number;
  width?: number;
  height?: number;
  fraction?: number;  
  snapTickSize?: number;
}

export const RulerSlider: React.FC<RulerSliderProps> = ({...props}) => {

  const {
    minValue = 0,
    maxValue = 3000,
    width = 100,
    height = 300,
    fraction = 0,
    snapTickSize = 0.4
  } = props;

  const scrollableHeight = snapTickSize * (maxValue - minValue)

  // Create a ref for the ScrollView
  const scrollViewRef = useRef(null);
  const [scrollY] = useState(new Animated.Value(0));

  // State to track the current scroll position
  const [scrollPosition, setScrollPosition] = useState(0);

  // Handle scroll event
  const handleScroll = (event) => {
    const { contentOffset } = event.nativeEvent; // Get the current scroll position
    const currentScroll = contentOffset.y; // Use the native scroll position directly
    if (currentScroll !== scrollPosition) {
      console.log(currentScroll, (currentScroll / scrollableHeight) * (maxValue - minValue)); // Log the scaled value
    }
    // scrollViewRef.current.scrollTo({ y: scrollPosition, animated: true });

  };

  // // Function to handle mouse wheel scroll
  // const handleWheel = (event) => {

  //   const scrollOffset = event.deltaY = 0 ? 2 : -2; // Move by 2 pixels on each wheel step
  //   const newScrollPosition = scrollPosition + scrollOffset;

  //   // Scroll to the new position
  //   if (scrollViewRef.current) {
  //     scrollViewRef.current.scrollTo({ y: newScrollPosition, animated: true });
  //   }

  //   // Update the scroll position state
  //   setScrollPosition(newScrollPosition);
  // };

  return (
    <View style={{
        maxHeight: height, 
        maxWidth: width,
        borderWidth: 0.5,
        borderRadius: 8,
      }}
    > 
      <Indicator top={height / 2}/>
      <Animated.ScrollView
          ref={scrollViewRef} // Assign the ref to the ScrollView
          showsVerticalScrollIndicator={false}
          // onScroll={handleScroll}
          scrollEventThrottle={16}
          bounces={false} // Disable bounce effect to ensure smoother scrolling
          // onWheel={handleWheel}
          decelerationRate="fast"
          snapToInterval={snapTickSize / 10}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        <View style={{minHeight: height / 2}} />
        <View style={{minHeight: scrollableHeight}}>
          <Ruler min={minValue} max={maxValue} step={100} width={width / 2} snapTickSize={snapTickSize}/>
          <Ruler min={minValue} max={maxValue} step={50} width={width / 3} snapTickSize={snapTickSize}/>
          <Ruler min={minValue} max={maxValue} step={25} width={width / 4} snapTickSize={snapTickSize}/>

          <Labels min={minValue} max={maxValue} step={100} snapTickSize={snapTickSize} fraction={fraction}/>

        </View>
        <View style={{minHeight: height / 2}} />
      </Animated.ScrollView>

    </View>
  );
}

// const minValue = 0;
// const segmentsCount = 200;
// const cSegmentHeight = 2;

// const cContainerHeight = 300;
// const cContainerWidth = 100;
// // const cTickTenthWidth = cContainerWidth / 2
// const cTickTenthWidth = cContainerWidth / 2 * 0.2
// const cTickHalfWidth = cContainerWidth / 2 * 0.66
// const cTickWidth = cContainerWidth / 2 * 0.33

// const cIndicatorWidth = cContainerWidth / 5;


// export const Tick = ({width, marginBottom, color}) => {
//   return (
//     <View
//             style={[
//               {
//                 backgroundColor: color,
//                 width: width,
//                 height: cSegmentHeight,
//                 marginBottom: marginBottom,
//               },

//             ]}
//           />
//   )
// }


// export const NumberTick = ({value, marginBottom, color}: {value: string, marginBottom: any, color: any}) => {

//   const tickStyle = {
//     width: cTickTenthWidth, 
//     height: cSegmentHeight, 
//     backgroundColor: color, 
//     flexShrink: 1
//   }

//   const containerStyle = {
//     width: "50%" ,
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     flexDirection: 'row',
//     height: cSegmentHeight,
//     marginBottom: marginBottom,
//     flex: 1,
//   }

//   return (
//     <View
//       style={containerStyle}
//     >
//       <View style={tickStyle}/>
//       <Text style={{fontSize: 10, flexShrink: 1}}>{value}</Text>
//       <View style={tickStyle}/>
//     </View>
//   )
// }


// export const Ruler = ({ segmentHeight, segmentSpacing, containerHeight }) => {
//   const spacerHeight = (containerHeight - segmentHeight) / 2;
//   const snapSegment = segmentHeight + segmentSpacing;
//   const rulerHeight = spacerHeight * 2 + (segmentsCount) * snapSegment;
//   const data = [...Array(segmentsCount+1).keys()].map(i => i + minValue / 2);
//   // const data = createArray(minValue, segmentsCount, 0.2);

//   return (
//     <View style={[styles.ruler, { height: rulerHeight }]}>
//       <View style={[styles.spacer, { height: spacerHeight }]} />
//       {data.map(i => {
//         const once = i % 1 === 0;
//         const half = i % 2.5 === 0;
//         const tenth = i % 10 === 0;

//         let tickWidth = cTickWidth;

//         if (tenth) {
//           tickWidth = cTickTenthWidth
//         } else if (half) {
//           tickWidth = cTickHalfWidth
//         }

//         return (
//           tenth 
//           ? <NumberTick 
//             value={`${i}`} 
//             color={"#333"} 
//             marginBottom={i === data.length - 1 ? 0 : segmentSpacing}
//             />
//           : <Tick 
//             width={tickWidth} 
//             marginBottom={i === data.length - 1 ? 0 : segmentSpacing} 
//             color={"#999"}
//           />
//         );
//       })}
//       <View style={[styles.spacer, { height: spacerHeight }]} />
//     </View>
//   );
// };


// Ruler.Indicator = ({containerHeight}: {containerHeight: number}) => {
//   return (
//     <View style={[styles.indicatorWrapper, { width: cContainerWidth - 2, top: (containerHeight - 2) / 2 }]}>
//       <View style={[styles.segmentIndicator, { width: cIndicatorWidth, height: 2 }]} />
//       <View style={[styles.segmentIndicator, { width: cIndicatorWidth, height: 2 }]} />
//     </View>
//   )
// }

// export const RulerSlider = () => {
//   const scrollViewRef = useRef(null);
//   const [scrollY] = useState(new Animated.Value(0));
//   const [initialValue] = useState(0);
//   const [value, setValue] = useState(minValue);
//   const [containerHeight, setContainerHeight] = useState(cContainerHeight); // Default height
//   // const segmentSpacing = cSegmentHeight / 2;
//   const segmentSpacing = cSegmentHeight * 4;
//   const snapSegment = cSegmentHeight + segmentSpacing;

//   useEffect(() => {
//     const scrollYListener = scrollY.addListener(({ value }) => {
//       // const newValue = value / (containerHeight / (snapSegment * segmentsCount)) + minValue;
//       // console.log(value, newValue, segmentSpacing, snapSegment)

//       setValue(value / snapSegment + minValue);
//     });

//     setTimeout(() => {
//       console.log(initialValue, minValue, snapSegment)

//       if (scrollViewRef.current) {

//         scrollViewRef.current.scrollTo({
//           y: (initialValue - minValue) * snapSegment,
//           x: 0,
//           animated: true
//         });
//       }
//     }, 1000);

//     return () => {
//       scrollY.removeListener(scrollYListener);
//     };
//   }, [scrollY, initialValue, snapSegment]);

//   return (
//     <View style={{width: cContainerWidth, height: cContainerHeight, borderWidth: 0.5, borderRadius: 8}}>
//         <TextInput value={value} onChange={(value) => setValue(parseFloat(value))}/>

//     <View
//       style={styles.container}
//       onLayout={(event) => {
//         const { height, width } = event.nativeEvent.layout;
//         setContainerHeight(height);
//       }}
//     >
//       <Ruler.Indicator containerHeight={containerHeight}/>
//       <Animated.ScrollView
//         style={{ maxHeight: containerHeight }}
//         ref={scrollViewRef}
//         contentContainerStyle={styles.scrollViewContainer}
//         bounces={false}
//         showsVerticalScrollIndicator={false}
//         scrollEventThrottle={5}
//         snapToInterval={snapSegment}
//         onScroll={Animated.event(
//           [{ nativeEvent: { contentOffset: { y: scrollY } } }],
//           { useNativeDriver: true }
//         )}
//       >
//         <Ruler segmentHeight={cSegmentHeight} segmentSpacing={segmentSpacing} containerHeight={containerHeight} />
//       </Animated.ScrollView>
//     </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   scrollViewContainer: {
//     justifyContent: 'flex-end'
//   },
//   indicatorWrapper: {
//     position: 'absolute',
//     alignSelf: 'center',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     flexDirection: 'row',
//   },
//   segmentIndicator: {
//     backgroundColor: 'turquoise'
//   },
//   container: {
//     flex: 1,
//     position: 'relative',
//   },
//   ruler: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     flexDirection: 'column',
//   },
//   segment: {
//     // height: 2
//   },
//   spacer: {
//     backgroundColor: 'red'
//   }
// });

// export default RulerSlider;


// import React, { useState, useRef, useEffect } from 'react';
// import {
//   TextInput,
//   Animated,
//   StyleSheet,
//   View
// } from 'react-native';

// const height = 200;

// const minValue = 0;
// const segmentsLength = 191;
// const segmentHeight = 2;
// const segmentSpacing = 5;
// const snapSegment = segmentHeight + segmentSpacing;
// const spacerHeight = (height - segmentHeight) / 2;
// const rulerHeight = spacerHeight * 2 + (segmentsLength - 1) * snapSegment;
// const indicatorWidth = 50;
// const indicatorHeight = 80;
// const data = [...Array(segmentsLength).keys()].map(i => i + minValue);

// export const Ruler = () => {
//   return (
//     <View style={styles.ruler}>
//       <View style={styles.spacer} />
//       {data.map(i => {
//         const tenth = i % 10 === 0;
//         return (
//           <View
//             key={i}
//             style={[
//               styles.segment,
//               {
//                 backgroundColor: tenth ? '#333' : '#999',
//                 width: tenth ? 40 : 20,
//                 marginBottom: i === data.length - 1 ? 0 : segmentSpacing
//               }
//             ]}
//           />
//         );
//       })}
//       <View style={styles.spacer} />
//     </View>
//   );
// };

// export const RulerSlider = () => {
//     const scrollViewRef = useRef(null);
//     const [scrollY] = useState(new Animated.Value(0));
//     const [initialValue] = useState(0);
//     const [value, setValue] = useState(minValue);
  
//     useEffect(() => {
//       const scrollYListener = scrollY.addListener(({ value }) => {
//         const newValue = Math.round(value / snapSegment) + minValue;
//         setValue(newValue);
//       });
  
//       setTimeout(() => {
//         if (scrollViewRef.current) {
//           scrollViewRef.current.scrollTo({
//             y: (initialValue - minValue) * snapSegment,
//             x: 0,
//             animated: true
//           });
//         }
//       }, 1000);
  
//       return () => {
//         scrollY.removeListener(scrollYListener);
//       };
//     }, [scrollY, initialValue]);
  
//     return (
//       <View style={styles.container}>
//         <View style={styles.indicatorWrapper}>
//           <View style={[styles.segment, styles.segmentIndicator]} />
//         </View>
//         <Animated.ScrollView
//           style={{ maxHeight: height }}
//           ref={scrollViewRef}
//           contentContainerStyle={styles.scrollViewContainerStyle}
//           bounces={false}
//           showsVerticalScrollIndicator={false}
//           scrollEventThrottle={5}
//           snapToInterval={snapSegment}
//           onScroll={Animated.event(
//             [{ nativeEvent: { contentOffset: { y: scrollY } } }],
//             { useNativeDriver: true }
//           )}
//         >
//           <Ruler />
//         </Animated.ScrollView>
//       </View>
//     );
//   };

// const styles = StyleSheet.create({
//   indicatorWrapper: {
//     position: 'absolute',
//     top: (height - indicatorHeight) / 2,
//     // left: 34,
//     alignSelf: 'center',
//     alignItems: 'center',
//     justifyContent: 'center',
//     height: indicatorHeight
//   },
//   segmentIndicator: {
//     width: indicatorWidth,
//     backgroundColor: 'turquoise'
//   },
//   container: {
//     flex: 1,
//     // backgroundColor: 'grey',
//     position: 'relative',
//     height: 50
//   },
//   ruler: {
//     height: rulerHeight,
//     alignItems: 'center',
//     justifyContent: 'center',
//     flexDirection: 'column'
//   },
//   segment: {
//     height: segmentHeight
//   },
//   scrollViewContainerStyle: {
//     justifyContent: 'flex-end',
//   },
//   ageTextStyle: {
//     fontSize: 42,
//     fontFamily: 'Menlo'
//   },
//   spacer: {
//     height: spacerHeight,
//     backgroundColor: 'red'
//   }
// });
