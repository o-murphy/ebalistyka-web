import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import { Divider, HelperText, List, Surface } from "react-native-paper";
import { usePreferredUnits } from "../../../context/preferredUnitsContext";
import { Angular, Distance, Energy, Pressure, Temperature, UNew, Unit, UnitProps, Weight } from "js-ballistics/dist/v2";
import { SettingsSaveBanner, UnitSelectorChip } from "./components";
import { ScreenBackground, ScrollViewSurface } from "../components";
import getFractionDigits from "../../../utils/fractionConvertor";
import MeasureFormField, { MeasureFormFieldProps } from "../../../components/widgets/measureFields/measureField";
import { useAppSettings } from "../../../context/settingsContext";

interface UnitConfig {
    icon: string;
    fKey: string;
    label: string;
    unitList: Unit[];
}


export const getUnitList = (measure: Object): Unit[] =>
    Object.keys(measure).map(
        (key: string): Unit => measure[key]
    );


type UnitClass = typeof Distance; // Add other unit classes if needed


const useCurrentValue = (
    value: number,
    unitTypeClass: UnitClass,
    defUnit: Unit,
    prefUnit: Unit
): number => {
    return new unitTypeClass(value, defUnit).In(prefUnit);
};


const TrajectoryStepField = ({ trajectoryStep, setTrajectoryStep, onError, units }) => {

    const accuracy = useMemo(() => getFractionDigits(1, UNew.Meter(1).In(units)), [units])

    const fieldProps: Partial<MeasureFormFieldProps> = useMemo(() => ({
        fKey: "homeScreenDistanceStep",
        label: "Home screen trajectory step",
        icon: "delta",
        fractionDigits: accuracy,
        step: 1 / (10 ** accuracy),
        suffix: UnitProps[units].symbol,
        minValue: UNew.Meter(0).In(units),
        maxValue: UNew.Meter(500).In(units),
    }), [accuracy, units])

    const value = useCurrentValue(trajectoryStep, Distance, Unit.Meter, units)
    const onValueChange = setTrajectoryStep

    return (
        <MeasureFormField
            {...fieldProps}
            value={value}
            onValueChange={onValueChange}
            onError={onError}
            strict={false}
        />
    )
}


const TrajectoryStep = ({ trajectoryStep, setTrajectoryStep, stepError, setStepError, units }) => {

    // const value = UNew.Meter(trajectoryStep).In(units)
    const onChange = (value) => {
        setTrajectoryStep({
            homeScreenDistanceStep: new Distance(value, units).In(Unit.Meter)
        })
    }

    return (
        <Surface style={{ marginVertical: 8 }} elevation={0}>
            <TrajectoryStepField trajectoryStep={trajectoryStep} units={units} setTrajectoryStep={onChange} onError={setStepError} />
            {stepError && <HelperText type="error" visible={!!stepError}>
                {stepError.message}
            </HelperText>}
        </Surface>
    )
}


const SettingsContent = () => {
    const { preferredUnits, setPreferredUnits } = usePreferredUnits();
    const [bannerVisible, setBannerVisible] = useState(false);
    const { appSettings, setAppSettings } = useAppSettings()

    const [localUnits, setLocalUnits] = useState(preferredUnits);
    const [localAppSettings, setLocalAppSettings] = useState(appSettings);

    const [stepError, setStepError] = useState(null);

    useEffect(() => {
        setLocalUnits(preferredUnits);
    }, [preferredUnits]);

    useEffect(() => {
        setLocalAppSettings(appSettings);
    }, [appSettings]);

    const handleUnitChange = (updatedUnit: Partial<typeof preferredUnits>) => {
        setLocalUnits((prev) => ({ ...prev, ...updatedUnit }));
        setBannerVisible(true)
    };

    const handleStepError = (err) => {
        setStepError(err)
    }

    const handleAppSettingsChange = (newProps) => {
        setLocalAppSettings((prev) => ({ ...prev, ...newProps }));
        console.log("THERE 2")
        setBannerVisible(true)
    };

    const handleSave = () => {
        setPreferredUnits(localUnits);
        setAppSettings(localAppSettings)
        setBannerVisible(false);
    };

    const handleDiscard = () => {
        setLocalUnits(preferredUnits);
        setLocalAppSettings(appSettings)
        setBannerVisible(false);
    };

    return (
        <Surface style={styles.container} elevation={0}>
            <SettingsSaveBanner
                visible={bannerVisible}
                onSubmit={handleSave}
                onDismiss={handleDiscard}
                error={stepError}
            />


            <ScrollViewSurface
                style={styles.scrollView}
                keyboardShouldPersistTaps="always"
                alwaysBounceVertical={false}
                showsVerticalScrollIndicator={true}
                surfaceStyle={styles.scrollViewContainer}
                elevation={1}
            >
                <List.Section title="Preferred units">
                    {renderUnitSelectors(localUnits, handleUnitChange)}
                </List.Section>

                <List.Section title="Home screen settings">

                    <Surface elevation={0} style={{ marginHorizontal: 16 }}>
                        <TrajectoryStep
                            units={localUnits.distance}
                            trajectoryStep={localAppSettings.homeScreenDistanceStep}
                            setTrajectoryStep={handleAppSettingsChange}
                            stepError={stepError}
                            setStepError={handleStepError}
                        />
                    </Surface>

                </List.Section>

            </ScrollViewSurface>
        </Surface>
    );
};

const renderUnitSelectors = (localUnits, handleUnitChange: (unit) => void) => {
    const unitsConfig: UnitConfig[] = [
        { icon: "map-marker-distance", fKey: "distance", label: "Distance units", unitList: [Unit.Meter, Unit.Foot, Unit.Yard] },
        { icon: "speedometer", fKey: "velocity", label: "Velocity units", unitList: [Unit.MPS, Unit.FPS] },
        { icon: "ruler", fKey: "sizes", label: "Sizes units", unitList: [Unit.Inch, Unit.Millimeter, Unit.Centimeter, Unit.Line] },
        { icon: "angle-acute", fKey: "angular", label: "Angular units", unitList: getUnitList(Angular) },
        { icon: "arrow-expand-vertical", fKey: "adjustment", label: "Adjustment units", unitList: getUnitList(Angular) },
        { icon: "arrow-expand-down", fKey: "drop", label: "Drop units", unitList: [Unit.Inch, Unit.Millimeter, Unit.Centimeter, Unit.Line, Unit.Meter, Unit.Yard] },
        { icon: "weight", fKey: "weight", label: "Weight units", unitList: getUnitList(Weight) },
        { icon: "thermometer", fKey: "temperature", label: "Temperature units", unitList: getUnitList(Temperature) },
        { icon: "gauge", fKey: "pressure", label: "Pressure units", unitList: getUnitList(Pressure) },
        { icon: "lightning-bolt", fKey: "energy", label: "Energy units", unitList: getUnitList(Energy) },
    ];

    const isChanged = (unit: UnitConfig, newValue: Unit) => {
        return localUnits[unit.fKey] !== newValue;
    };

    const handleChange = (unit: UnitConfig, value: Unit) => {
        return isChanged(unit, value) && handleUnitChange({ [unit.fKey]: value });
    };

    return unitsConfig.map((unit, index) => (
        <Surface key={unit.fKey} elevation={0}>
            <UnitSelectorChip
                icon={unit.icon}
                label={unit.label}
                value={localUnits[unit.fKey]}
                options={unit.unitList
                    .map((value) => {
                        const unitProps = UnitProps[value];
                        return unitProps ? { label: unitProps.name, value } : null;
                    })
                    .filter((option) => option !== null)} // filter out any null values
                onValueChange={(value) => handleChange(unit, value)}
            />
            {index < unitsConfig.length - 1 && <Divider />}
        </Surface>
    ));
};


const SettingsScreen = ({ navigation }) => {
    return (
        <ScreenBackground>
            <SettingsContent />
        </ScreenBackground>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
        paddingBottom: 32,
    },
    scrollViewContainer: {
        borderBottomRightRadius: 16,
        borderBottomLeftRadius: 16,
    },
    unitRow: {
        flex: 1,
        marginVertical: 4,
        justifyContent: "center",
    },
});

export default SettingsScreen;