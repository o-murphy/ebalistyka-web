import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
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
import { TrajectoryTable, TrajectoryChart, WindageChart, DragChart } from '../widgets/trajectoryData';
import CustomCard from '../cards/customCard';
import { useProfile } from '../../context/profileContext';
import CalculationStateCard from '../cards/calculationStateCard';
import ShotParamsCard from '../cards/shotPropsCard';



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

                        <View style={{ ...styles.column, flex: 4, minWidth: 240, }}>
                            <CalculationStateCard cardStyle={{ ...styles.column, }} />

                            <ScrollView style={{ ...styles.column, }}
                                keyboardShouldPersistTaps="always"
                                alwaysBounceVertical={false}
                                showsVerticalScrollIndicator={false}
                            >

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


                        </View>


                        <ScrollView
                            style={{ ...styles.column, flex: 1, minWidth: 240 }}
                            keyboardShouldPersistTaps="always"
                            alwaysBounceVertical={false}
                            showsVerticalScrollIndicator={false}
                        >
                            <CurrentConditionsCard expanded={true} label='Current conditions' />
                            <CurrentWindCard expanded={true} label='Current wind' />
                            <ShotParamsCard expanded={true} label="Shot parameters" />
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
