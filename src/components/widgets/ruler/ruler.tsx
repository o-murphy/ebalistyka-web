import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle
} from 'react-native';
import { Text, useTheme } from 'react-native-paper';


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
  
  const theme = useTheme();

  let cur = min;
  
  const ticks = []

  while (cur <= max) {
    ticks.push(<View style={{height: snapTickSize * step}}>
      <View style={{height: 1, width: width, backgroundColor: theme.colors.outline }} />
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

  const theme = useTheme();


  const ticks = []
  const fontSize = snapTickSize * step / 5

  while (cur <= max) {


    ticks.push(<View style={{height: snapTickSize * step }}>
      <Text style={{
        fontSize: fontSize, 
        textAlign: "center",
        top: - fontSize / 2,
        backgroundColor: theme.colors.onSecondary, 
        paddingHorizontal: fontSize / 2
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

export const Indicator = ({top, snapTickSize}) => {
  const theme = useTheme();

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
      <View style={{height: 3, backgroundColor: theme.colors.outline, width: 20}}/>
      <View style={{height: 3, backgroundColor: theme.colors.outline, width: 20}}/>
    </View>
  );
};

export interface RulerSliderProps {
  minValue?: number;
  maxValue?: number;
  step?: number;
  width?: number;
  height?: number;
  fraction?: number;  
  tickSize?: number;

  value: number;
  onChange?: (value: number) => void;
  style?: StyleProp<ViewStyle>;
}

export const RulerSlider: React.FC<RulerSliderProps> = ({...props}) => {
  const theme = useTheme();

  const {
    minValue = 0,
    maxValue = 3000,
    step = 1,
    width = 100,
    height = 300,
    fraction = 0,
    tickSize = 8,
    value,
    onChange,
    style = null
  } = props;

  const scrollViewRef = useRef(null);

  const snapTickSize = tickSize / step
  const scrollableHeight = snapTickSize * (maxValue - minValue);

  useEffect(() => {
    // Calculate the scroll position based on localValue
    const scrollPosition = (value - minValue) * (scrollableHeight / (maxValue - minValue));

    // Scroll to the calculated position
    scrollViewRef.current?.scrollTo({
      y: scrollPosition,
      animated: false
    });
  }, []);

  const handleScroll = (event) => {
    const currentScroll = event.nativeEvent.contentOffset.y;
    const newValue = (maxValue - minValue) * (currentScroll / scrollableHeight) + minValue;
    onChange?.(Math.round(newValue / step) * step)
  };

  return (
    <View style={[style, {height: height, width: width}]}
    > 
      <Indicator top={height / 2} snapTickSize={snapTickSize}/>
      <Animated.ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          bounces={false}
          decelerationRate="fast"
          snapToInterval={snapTickSize / 10}

          style={{...styles.scrollViewStyle, width: width / 2, alignSelf: "center", backgroundColor: theme.colors.onSecondary, borderColor: theme.colors.outline}}
      >
        <View style={{minHeight: height / 2 }} />
        <View style={{minHeight: scrollableHeight, }}>
          <Ruler min={minValue} max={maxValue} step={step * 10} width={width / 3} snapTickSize={snapTickSize}/>
          <Ruler min={minValue} max={maxValue} step={step * 5} width={width / 4} snapTickSize={snapTickSize}/>
          {/* <Ruler min={minValue} max={maxValue} step={step * 2.5} width={width / 4} snapTickSize={snapTickSize}/> */}
          <Ruler min={minValue} max={maxValue} step={step * 2.5} width={width / 8} snapTickSize={snapTickSize}/>
          <Labels min={minValue} max={maxValue} step={step * 10} snapTickSize={snapTickSize} fraction={fraction}/>
        </View>
        <View style={{minHeight: height / 2}} />
      </Animated.ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  scrollViewStyle: {
    borderWidth: 0.5,
    borderRadius: 8,
  }
})
