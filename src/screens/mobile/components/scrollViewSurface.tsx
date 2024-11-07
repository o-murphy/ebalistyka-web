import React, { forwardRef } from 'react';
import { ScrollView, ScrollViewProps, StyleProp, ViewStyle, Ref } from 'react-native';
import { Surface, SurfaceProps } from 'react-native-paper';

interface ScrollViewSurfaceProps extends Omit<ScrollViewProps, 'style'>, Omit<SurfaceProps, 'style' | 'children'> {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;         // Style for the ScrollView
  surfaceStyle?: StyleProp<ViewStyle>;   // Style for the Surface
}

const ScrollViewSurface = forwardRef<ScrollView, ScrollViewSurfaceProps>(({
  children = null, 
  style = null, 
  surfaceStyle = null, 
  ...props
}, ref) => {
  return (
    <ScrollView ref={ref} style={style} {...props}>
      <Surface style={surfaceStyle} {...props}>
        {children}
      </Surface>
    </ScrollView>
  );
});

export default ScrollViewSurface;
