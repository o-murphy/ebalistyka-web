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
import TrajectoryTable from '../widgets/trajectoryTable';
import TrajectoryChart from '../widgets/trajectoryChart';
import WindageChart from '../widgets/windageChart';
import CustomCard from '../cards/customCard';
import { preferredUnits } from 'js-ballistics/dist/v2';
import { Unit } from 'js-ballistics';
import { useProfile } from '../../context/profileContext';
import CalculationErrorCard from '../cards/calculationErrorCard';
import DragChart from '../widgets/dragChart';

preferredUnits.distance = Unit.Meter
preferredUnits.velocity = Unit.MPS
preferredUnits.angular = Unit.Degree
preferredUnits.adjustment = Unit.MIL
preferredUnits.drop = Unit.Centimeter


export default function MainScreen() {

    const { theme } = useTheme();
    const { hitResult } = useProfile();

    const hitResultError = hitResult instanceof Error;


    return (
        <PaperProvider theme={theme}>
            <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
                <TopAppBar />

                <View style={{ ...styles.row }}>

                    <ScrollView
                        style={{ ...styles.column, flex: 1, minWidth: 240, }}
                        keyboardShouldPersistTaps="always"
                        alwaysBounceVertical={false}
                        showsVerticalScrollIndicator={false}
                    >
                        <WeaponCard expanded={true} />
                        <ProjectileCard expanded={true} />
                        <BulletCard expanded={true} />
                        <ZeroAtmoCard expanded={false} />
                    </ScrollView>

                    <ScrollView style={{ ...styles.column, flex: 4, minWidth: 240, }}
                        keyboardShouldPersistTaps="always"
                        alwaysBounceVertical={false}
                        showsVerticalScrollIndicator={false}
                    >

                        {hitResultError && <CalculationErrorCard title='Calculation Error!' details={hitResult?.message || undefined} />}

                        <TrajectoryTable />

                        {!hitResultError && hitResult ? (
                            <CustomCard title='Chart'>
                                <TrajectoryChart />
                                <WindageChart />
                                <DragChart />
                            </CustomCard>

                        ) : (
                            <CustomCard title='Chart'>

                            </CustomCard>
                        )}

                    </ScrollView>

                    <ScrollView
                        style={{ ...styles.column, flex: 1, minWidth: 240 }}
                        keyboardShouldPersistTaps="always"
                        alwaysBounceVertical={false}
                        showsVerticalScrollIndicator={false}
                    >
                        <CurrentConditionsCard expanded={true} label='Current conditions' />
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
