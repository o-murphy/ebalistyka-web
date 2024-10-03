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
import { ZeroTable, AdjustedTable, DragChart, HorizontalTrajectoryChart, AdjustedTrajectoryChart, HorizontalWindageChart, AdjustedWindageChart, TrajectoryReticle, AdjustedReticle } from '../widgets/trajectoryData';
import CustomCard from '../cards/customCard';
import { DataToDisplay, TrajectoryMode, useCalculator } from '../../context/profileContext';
import CalculationStateCard from '../cards/calculationStateCard';
import ShotParamsCard from '../cards/shotPropsCard';
import CalculationModeCard from '../cards/calculationModeCard';



const MainScreen = () => {

    const { theme } = useTheme();
    const { hitResult, adjustedResult, trajectoryMode, dataToDisplay } = useCalculator();

    const curHitResult = trajectoryMode === TrajectoryMode.Zero ? hitResult : adjustedResult
    const hitResultError = curHitResult instanceof Error;


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

                    <View style={{ ...styles.column, flex: 4, minWidth: 240, }}>
                        <CalculationStateCard cardStyle={{ ...styles.column, }} />
                        <CalculationModeCard cardStyle={{ ...styles.column }} />

                        <ScrollView style={{ ...styles.column, }}
                            keyboardShouldPersistTaps="always"
                            alwaysBounceVertical={false}
                            showsVerticalScrollIndicator={false}
                        >
                            {dataToDisplay === DataToDisplay.DragModel && (
                                <CustomCard title='Drag model'>
                                    <DragChart />
                                </CustomCard>
                            )}

                            {
                                (!hitResultError && curHitResult && dataToDisplay !== DataToDisplay.DragModel)
                                &&
                                (
                                    trajectoryMode === TrajectoryMode.Zero
                                        ?
                                        <CustomCard title='Zero shot'>
                                            {dataToDisplay === DataToDisplay.Table && <ZeroTable />}
                                            {dataToDisplay === DataToDisplay.Chart && <HorizontalTrajectoryChart />}
                                            {dataToDisplay === DataToDisplay.Chart && <HorizontalWindageChart />}
                                            {dataToDisplay === DataToDisplay.Reticle && <TrajectoryReticle />}

                                        </CustomCard>
                                        :
                                        <CustomCard title='Adjusted shot'>
                                            {dataToDisplay === DataToDisplay.Table && <AdjustedTable />}
                                            {dataToDisplay === DataToDisplay.Chart && <AdjustedTrajectoryChart />}
                                            {dataToDisplay === DataToDisplay.Chart && <AdjustedWindageChart />}
                                            {dataToDisplay === DataToDisplay.Reticle && <AdjustedReticle />}
                                        </CustomCard>
                                )
                            }

                            {(hitResultError || !curHitResult) && dataToDisplay !== DataToDisplay.DragModel && <CustomCard title='No data' />}


                        </ScrollView>
                    </View>

                    <ScrollView
                        style={{ ...styles.column, flex: 1, minWidth: 280 }}
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

export default MainScreen;
