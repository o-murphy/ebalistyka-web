import React, { forwardRef } from 'react';
import { LayoutChangeEvent, ScrollView, ScrollViewProps, StyleProp, ViewStyle } from 'react-native';
import { Surface, SurfaceProps } from 'react-native-paper';

interface ScrollViewSurfaceProps extends Omit<ScrollViewProps, 'style' | 'onLayout'>, Omit<SurfaceProps, 'style' | 'children' | 'onLayout'> {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;         // Style for the ScrollView
  surfaceStyle?: StyleProp<ViewStyle>;   // Style for the Surface
  onLayout?: (event: LayoutChangeEvent) => void;
}

const ScrollViewSurface = forwardRef<ScrollView, ScrollViewSurfaceProps>(({
  children = null, 
  style = null, 
  surfaceStyle = null, 
  onLayout = null,
  ...props
}, ref) => {
  return (
    <ScrollView ref={ref} style={style} onLayout={onLayout} {...props}>
      <Surface style={surfaceStyle} {...props}>
        {children}
      </Surface>
    </ScrollView>
  );
});

export default ScrollViewSurface;
