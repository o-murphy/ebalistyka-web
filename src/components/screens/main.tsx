import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import TrajectoryData from '../widgets/trajectoryData';
import WeaponCard from '../cards/weaponCard';
import ProjectileCard from '../cards/projectileCard';
import BulletCard from '../cards/bulletCard';
import ZeroAtmoCard from '../cards/zeroAtmoCard';
import CurrentWindCard from '../cards/currentWindCard';
import CurrentConditionsCard from '../cards/currentConditionsCard';
// import { isMobile } from 'react-device-detect';
import { useTheme } from '../../context/themeContext';
import { PaperProvider } from 'react-native-paper';
import TopAppBar from '../widgets/topAppBar';


export default function MainScreen() {

    const { theme } = useTheme();

    return (
        <PaperProvider theme={theme}>
            <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
                <TopAppBar />

                <View style={{ ...styles.row }}>

                    <ScrollView
                        style={{ ...styles.column, flex: 1, minWidth: 280, }}
                        keyboardShouldPersistTaps="always"
                        alwaysBounceVertical={false}
                        showsVerticalScrollIndicator={false}
                    >
                        <WeaponCard expanded={true} />
                        <ProjectileCard expanded={true} />
                        <BulletCard expanded={true} />
                        <ZeroAtmoCard expanded={false} />
                    </ScrollView>

                    <ScrollView style={{ ...styles.column, flex: 3, minWidth: 600, }}
                        keyboardShouldPersistTaps="always"
                        alwaysBounceVertical={false}
                        showsVerticalScrollIndicator={false}
                    >
                        <TrajectoryData />
                    </ScrollView>

                    <ScrollView
                        style={{ ...styles.column, flex: 1, minWidth: 280 }}
                        keyboardShouldPersistTaps="always"
                        alwaysBounceVertical={false}
                        showsVerticalScrollIndicator={false}
                    >
                        <CurrentConditionsCard expanded={true} label='Current atmosphere' />
                        <CurrentWindCard expanded={true} label='Current wind' />
                    </ScrollView>

                </View>
            </View>

        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: "row",
    },
    column: {
        flex: 1,
        flexDirection: "column",
    }
});
