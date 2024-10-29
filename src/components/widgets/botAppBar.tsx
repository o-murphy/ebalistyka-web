import { Appbar, FAB, useTheme } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";

const BOTTOM_APPBAR_HEIGHT = 64;
const MEDIUM_FAB_HEIGHT = 40;

const BotAppBar = () => {
    const { bottom } = useSafeAreaInsets();
    const navigation: any = useNavigation()
    const theme = useTheme();
  
    const [currentRoute, setCurrentRoute] = useState('');

    useEffect(() => {
        return navigation.addListener('state', () => {
            const currentRouteName = navigation.getCurrentRoute()?.name || '';
            setCurrentRoute(currentRouteName);
        });
    }, [navigation]);

    const onHomePress = () => {
        if (!(currentRoute === "Home")) {
            navigation.navigate("Home")
        }
    }

    const onWeatherPress = () => {
        navigation.navigate("Weather")
    }

    const onTablePress = () => {
        navigation.navigate("Table")
    }

    const onConvertorPress = () => {
        navigation.navigate("Convertor")
    }

    return (
        <Appbar
            elevated={true}
            style={[
                styles.bottomBar,
                {
                    height: BOTTOM_APPBAR_HEIGHT + bottom,
                    backgroundColor: theme.colors.elevation.level2,
                },
            ]}
            safeAreaInsets={{bottom}}
        >
        <Appbar.Action icon="home" onPress={onHomePress} />
        <Appbar.Action icon="weather-partly-cloudy" onPress={onWeatherPress} />
        <Appbar.Action icon="table" onPress={onTablePress} />
        <Appbar.Action icon="calculator" onPress={onConvertorPress} />

        <FAB
          mode="flat"
          size="small"
          icon="plus"
          onPress={() => {}}
          style={[
            styles.fab,
            {top: (BOTTOM_APPBAR_HEIGHT - MEDIUM_FAB_HEIGHT) / 2},
        ]}
        />
      </Appbar>
    );
};

  const styles = StyleSheet.create({

    fab: {
      position: 'absolute',
      right: 16,
    },

    bottomBar: {
        backgroundColor: 'aquamarine',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
    },
  });

export default BotAppBar;
