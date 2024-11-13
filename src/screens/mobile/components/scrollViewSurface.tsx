import React, { forwardRef } from 'react';
import { LayoutChangeEvent, ScrollView, ScrollViewProps, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { Surface, SurfaceProps, useTheme } from 'react-native-paper';

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

  const theme = useTheme()

  const _styles = StyleSheet.create({
    scrollView: {
      ...styles.scrollView,
      scrollbarColor: `${theme.colors.secondary} transparent`
    },
  })

  return (
    <ScrollView ref={ref} style={[_styles.scrollView, style]} onLayout={onLayout} {...props}>
      <Surface style={surfaceStyle} {...props}>
        {children}
      </Surface>
    </ScrollView>
  );
});


const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    scrollbarWidth: 'thin', // For Firefox
    // scrollbarColor: '#6200ee transparent', // Scrollbar color
  },
  '@global': {
    /* Chrome, Safari, and Edge */
    '::-webkit-scrollbar': {
      width: 6,
    },
    '::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '::-webkit-scrollbar-thumb': {
      backgroundColor: '#6200ee',
      borderRadius: 3,
    },
  },
});

export default ScrollViewSurface;
