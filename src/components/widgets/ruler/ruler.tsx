import React, { useState, useRef, useEffect } from 'react';
import {
  TextInput,
  Animated,
  StyleSheet,
  View
} from 'react-native';

const height = 200;

const minValue = 0;
const segmentsLength = 191;
const segmentHeight = 2;
const segmentSpacing = 5;
const snapSegment = segmentHeight + segmentSpacing;
const spacerHeight = (height - segmentHeight) / 2;
const rulerHeight = spacerHeight * 2 + (segmentsLength - 1) * snapSegment;
const indicatorWidth = 50;
const indicatorHeight = 80;
const data = [...Array(segmentsLength).keys()].map(i => i + minValue);

export const Ruler = () => {
  return (
    <View style={styles.ruler}>
      <View style={styles.spacer} />
      {data.map(i => {
        const tenth = i % 10 === 0;
        return (
          <View
            key={i}
            style={[
              styles.segment,
              {
                backgroundColor: tenth ? '#333' : '#999',
                width: tenth ? 40 : 20,
                marginBottom: i === data.length - 1 ? 0 : segmentSpacing
              }
            ]}
          />
        );
      })}
      <View style={styles.spacer} />
    </View>
  );
};

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
//                 <View style={styles.indicatorWrapper}>
//           {/* <TextInput
//             value={age.toString()}
//             style={styles.ageTextStyle}
//             editable={false} // prevent user from editing it
//           /> */}
//           <View style={[styles.segment, styles.segmentIndicator]} />
//         </View>
//         <Animated.ScrollView
//           style={{maxHeight: height}}
//           ref={scrollViewRef}
//           contentContainerStyle={styles.scrollViewContainerStyle}
//           bounces={false}
//           showsVerticalScrollIndicator={false}
//           scrollEventThrottle={16}
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
// };


// export const RulerSlider = () => {
//   const scrollViewRef = useRef(null);
//   const [scrollY] = useState(new Animated.Value(0));
//   const [initialValue] = useState(0);
//   const [value, setValue] = useState(minValue);

//   const panResponder = useRef(
//     PanResponder.create({
//       onMoveShouldSetPanResponder: () => true,
//       onPanResponderMove: Animated.event(
//         [{ nativeEvent: { contentOffset: { y: scrollY } } }],
//         { useNativeDriver: false }
//       ),
//       onPanResponderRelease: (evt, gestureState) => {
//         const newValue = Math.round(gestureState.dy / snapSegment) + minValue;
//         setValue(newValue);
//         scrollViewRef.current.scrollTo({
//           y: newValue * snapSegment,
//           animated: true
//         });
//       },
//     })
//   ).current;

//   useEffect(() => {
//     const scrollYListener = scrollY.addListener(({ value }) => {
//       const newValue = Math.round(value / snapSegment) + minValue;
//       setValue(newValue);
//     });

//     setTimeout(() => {
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
//   }, [scrollY, initialValue]);

//   return (
//     <View style={styles.container} {...panResponder.panHandlers}>
//       <View style={styles.indicatorWrapper}>
//         <View style={[styles.segment, styles.segmentIndicator]} />
//       </View>
//       <Animated.ScrollView
//         style={{ maxHeight: height }}
//         ref={scrollViewRef}
//         contentContainerStyle={styles.scrollViewContainerStyle}
//         bounces={false}
//         showsVerticalScrollIndicator={false}
//         scrollEventThrottle={16}
//         snapToInterval={snapSegment}
//         onScroll={Animated.event(
//           [{ nativeEvent: { contentOffset: { y: scrollY } } }],
//           { useNativeDriver: true }
//         )}
//       >
//         <Ruler />
//       </Animated.ScrollView>
//     </View>
//   );
// };

export const RulerSlider = () => {
    const scrollViewRef = useRef(null);
    const [scrollY] = useState(new Animated.Value(0));
    const [initialValue] = useState(0);
    const [value, setValue] = useState(minValue);
  
    useEffect(() => {
      const scrollYListener = scrollY.addListener(({ value }) => {
        const newValue = Math.round(value / snapSegment) + minValue;
        setValue(newValue);
      });
  
      setTimeout(() => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({
            y: (initialValue - minValue) * snapSegment,
            x: 0,
            animated: true
          });
        }
      }, 1000);
  
      return () => {
        scrollY.removeListener(scrollYListener);
      };
    }, [scrollY, initialValue]);
  
    return (
      <View style={styles.container}>
        <View style={styles.indicatorWrapper}>
          <View style={[styles.segment, styles.segmentIndicator]} />
        </View>
        <Animated.ScrollView
          style={{ maxHeight: height }}
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollViewContainerStyle}
          bounces={false}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={5}
          snapToInterval={snapSegment}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
        >
          <Ruler />
        </Animated.ScrollView>
      </View>
    );
  };

const styles = StyleSheet.create({
  indicatorWrapper: {
    position: 'absolute',
    top: (height - indicatorHeight) / 2,
    // left: 34,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: indicatorHeight
  },
  segmentIndicator: {
    width: indicatorWidth,
    backgroundColor: 'turquoise'
  },
  container: {
    flex: 1,
    // backgroundColor: 'grey',
    position: 'relative',
    height: 50
  },
  ruler: {
    height: rulerHeight,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  segment: {
    height: segmentHeight
  },
  scrollViewContainerStyle: {
    justifyContent: 'flex-end',
  },
  ageTextStyle: {
    fontSize: 42,
    fontFamily: 'Menlo'
  },
  spacer: {
    height: spacerHeight,
    backgroundColor: 'red'
  }
});
