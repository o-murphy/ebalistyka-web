import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import WeaponCard from '../cards/weaponCard';
import ProjectileCard from '../cards/projectileCard';
import BulletCard from '../cards/bulletCard';
import ZeroAtmoCard from '../cards/zeroAtmoCard';
import CurrentWindCard from '../cards/currentWindCard';
import CurrentAtmoCard from '../cards/currentAtmoCard';
import { useTheme } from '../../context/themeContext';
import { PaperProvider } from 'react-native-paper';
import TopAppBar from '../widgets/topAppBar';
import { ZeroTable, AdjustedTable, DragChart, HorizontalTrajectoryChart, AdjustedTrajectoryChart, HorizontalWindageChart, AdjustedWindageChart, TrajectoryReticle, AdjustedReticle } from '../widgets/trajectoryData';
import CustomCard from '../cards/customCard';
import { DataToDisplay, TrajectoryMode, useCalculator } from '../../context/profileContext';
import CalculationStateCard from '../cards/calculationStateCard';
import TrajectoryParamsCard from '../cards/trajectoryParamsCard';
import CalculationModeCard from '../cards/calculationModeCard';
import SingleShotCard from '../cards/singleShotCard';
import TargetCard from '../cards/targetCard';



const LeftColumn = () => {
    return (
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
    )
}


const RightColumn = () => {

    const { trajectoryMode } = useCalculator();

    return (
        <ScrollView
            style={{ ...styles.column, flex: 1, minWidth: 280 }}
            keyboardShouldPersistTaps="always"
            alwaysBounceVertical={false}
            showsVerticalScrollIndicator={false}
        >
            {trajectoryMode === TrajectoryMode.Zero && <TargetCard expanded={true} />}
            {trajectoryMode === TrajectoryMode.Zero && <CurrentWindCard expanded={true} label='Current wind' />}
            <CurrentAtmoCard expanded={true} />
            <TrajectoryParamsCard expanded={true} label="Shot parameters" />
        </ScrollView>
    )
}

const CenterColumn = ({ children }) => {
    return (
        <View style={{ ...styles.column, flex: 4, minWidth: 240, }}>

            <CalculationStateCard cardStyle={{ ...styles.column, }} />
            <CalculationModeCard cardStyle={{ ...styles.column }} />
            {children}
        </View>

    )
}

const ZeroTrajectory = () => {
    const { dataToDisplay } = useCalculator();

    return (
        <CustomCard title='Zero shot'>
            {dataToDisplay === DataToDisplay.Table && <ZeroTable />}
            {dataToDisplay === DataToDisplay.Chart && <HorizontalTrajectoryChart />}
            {dataToDisplay === DataToDisplay.Chart && <HorizontalWindageChart />}
            {dataToDisplay === DataToDisplay.Reticle && <TrajectoryReticle />}
        </CustomCard>
    )
}

const AdjustedTrajectory = () => {
    const { dataToDisplay } = useCalculator();

    return (
        <CustomCard title='Adjusted shot'>
            {dataToDisplay === DataToDisplay.Table && <AdjustedTable />}
            {dataToDisplay === DataToDisplay.Chart && <AdjustedTrajectoryChart />}
            {dataToDisplay === DataToDisplay.Chart && <AdjustedWindageChart />}
            {dataToDisplay === DataToDisplay.Reticle && <AdjustedReticle />}
        </CustomCard>
    )
}

const DragChartCard = () => {
    return (
        <CustomCard title='Drag model'>
            <DragChart />
        </CustomCard>
    )
}



const MainScreen = () => {
    const { theme } = useTheme();
    const { hitResult, adjustedResult, trajectoryMode, dataToDisplay } = useCalculator();

    const renderTrajectory = () => {
    
        const curHitResult = useMemo(() => (
            trajectoryMode === TrajectoryMode.Zero ? hitResult : adjustedResult
        ), [hitResult, adjustedResult, trajectoryMode]);
    
        const hitResultError = useMemo(() => curHitResult instanceof Error, [curHitResult]);
    
        if (hitResultError || !curHitResult) {
            return dataToDisplay !== DataToDisplay.DragModel && <CustomCard title='No data' />;
        }
        return trajectoryMode === TrajectoryMode.Zero ? <ZeroTrajectory /> : <AdjustedTrajectory />;
    };

    return (
        <PaperProvider theme={theme}>
            <TopAppBar />
            <View style={[styles.row, { backgroundColor: theme.colors.background }]}>
                <LeftColumn />
                <CenterColumn>
                    <ScrollView
                        style={styles.column}
                        keyboardShouldPersistTaps="always"
                        alwaysBounceVertical={false}
                        showsVerticalScrollIndicator={false}
                    >
                        {trajectoryMode === TrajectoryMode.Adjusted && <SingleShotCard expanded={true} />}
                        {dataToDisplay === DataToDisplay.DragModel && <DragChartCard />}
                        {renderTrajectory()}
                    </ScrollView>
                </CenterColumn>
                <RightColumn />
            </View>
        </PaperProvider>
    );
};

// const MainScreen = () => {

//     const { theme } = useTheme();
//     const { hitResult, adjustedResult, trajectoryMode, dataToDisplay } = useCalculator();

//     const curHitResult = trajectoryMode === TrajectoryMode.Zero ? hitResult : adjustedResult
//     const hitResultError = curHitResult instanceof Error;

//     return (
//         <PaperProvider theme={theme}>
//             <TopAppBar />
//             <View style={{ ...styles.row, backgroundColor: theme.colors.background }}>
//                 <LeftColumn />
//                 <CenterColumn>
//                     <ScrollView style={{ ...styles.column, }}
//                         keyboardShouldPersistTaps="always"
//                         alwaysBounceVertical={false}
//                         showsVerticalScrollIndicator={false}
//                     >

//                         {trajectoryMode === TrajectoryMode.Adjusted && <SingleShotCard expanded={true} />}
//                         {dataToDisplay === DataToDisplay.DragModel && <DragChartCard />}

//                         {
//                             (!hitResultError && curHitResult && dataToDisplay !== DataToDisplay.DragModel)
//                             &&
//                             (trajectoryMode === TrajectoryMode.Zero ? <ZeroTrajectory /> : <AdjustedTrajectory />)
//                         }

//                         {(hitResultError || !curHitResult) && dataToDisplay !== DataToDisplay.DragModel && <CustomCard title='No data' />}

//                     </ScrollView>
//                 </CenterColumn>
//                 <RightColumn />
//             </View>
//         </PaperProvider>
//     );
// }

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
