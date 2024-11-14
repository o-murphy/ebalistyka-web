import { ActivityIndicator, useTheme } from "react-native-paper"
import { useProfile } from "../../context/profileContext"
import { Animated, View } from "react-native"
import { useEffect, useRef } from "react";


export const BusyOverlay = ({ children }) => {
    const { inProgress } = useProfile();
    const theme = useTheme()

    return (
        <View style={{ flex: 1 }}>
            {inProgress && (
                <View style={{
                    position: "absolute",
                    height: "100%",
                    width: "100%",  // Fixed width
                    backgroundColor: theme.colors.backdrop,
                    zIndex: 1,  // Ensures overlay is on top,
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <ActivityIndicator size={100} />
                </View>
            )}
            <View style={{ flex: 1, zIndex: 0 }}>
                {children}
            </View>
        </View>
    );
};


export const BusyOverlayAnimated = ({ children }) => {
  const { inProgress } = useProfile();
  const theme = useTheme()

  // Create an animated value for opacity
  const opacity = useRef(new Animated.Value(0)).current;

  // Animate opacity when `inProgress` changes
  useEffect(() => {
    Animated.timing(opacity, {
      toValue: inProgress ? 1 : 0, // Fade in if `inProgress` is true, fade out otherwise
      duration: 300,               // Adjust duration for desired speed
      useNativeDriver: true,       // Use native driver for better performance
    }).start();
  }, [inProgress]);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, zIndex: 0 }}>
        {children}
      </View>
      {inProgress && (
        <Animated.View
          style={{
            position: "absolute",
            height: "100%",
            width: "100%",
            backgroundColor: theme.colors.backdrop,
            opacity: opacity,      // Bind animated opacity value
            zIndex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size={100} />
        </Animated.View>
      )}
    </View>
  );
};
