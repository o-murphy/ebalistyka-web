import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import { Divider, HelperText, List, Surface } from "react-native-paper";
import { usePreferredUnits } from "../../../context/preferredUnitsContext";
import { Angular, Energy, Pressure, Temperature, Unit, UnitProps, Weight } from "js-ballistics/dist/v2";
import { SettingsSaveBanner, UnitSelectorChip } from "./components";
import { ScreenBackground, ScrollViewSurface } from "../components";
import MeasureFormField, { MeasureFormFieldProps } from "../../../components/widgets/measureFields/measureField";
import { useAppSettings } from "../../../context/settingsContext";
import { DimensionProps } from "../../../hooks/dimension";

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


const TrajectoryStep = (
    { dimension, value, onValueChange, onError }: {
        dimension: DimensionProps, 
        value: number,
        onValueChange: (value: number) => void,
        onError: (err: any) => void
    }
) => {
    
    const fieldProps: Partial<MeasureFormFieldProps> = useMemo(() => ({
        fKey: "homeScreenDistanceStep",
        label: "Home screen trajectory step",
        icon: "delta",
        fractionDigits: dimension.rangePref.accuracy,
        step: 1 / (10 ** dimension.rangePref.accuracy),
        suffix: dimension.symbol,
        minValue: dimension.rangePref.min,
        maxValue: dimension.rangePref.max,
    }), [dimension])

    const [localError, setLocalError] = useState(null)

    const setErr = (err) => {
        setLocalError(err)
        onError(err)
    }

    return (
        <Surface style={{ marginVertical: 8 }} elevation={0}>
            <MeasureFormField
                {...fieldProps}
                value={value}
                onValueChange={onValueChange}
                onError={setErr}
                strict={false}
            />
            {localError && <HelperText type="error" visible={!!localError}>
                {localError.message}
            </HelperText>}
        </Surface>
    )
}


const SettingsContent = () => {
    const { preferredUnits, setPreferredUnits } = usePreferredUnits();
    const [bannerVisible, setBannerVisible] = useState(false);
    const { homeScreenDistanceStep } = useAppSettings()

    const [localUnits, setLocalUnits] = useState(preferredUnits);

    const [ localHsd, setLocalHsd ] = useState(homeScreenDistanceStep.asPref)
    const [ hsdError, setHsdError ] = useState(null)

    useEffect(() => {
        setLocalUnits(preferredUnits);
    }, [preferredUnits]);

    useEffect(() => {
        setLocalHsd(homeScreenDistanceStep.asPref)
    }, [homeScreenDistanceStep])

    const handleUnitChange = (updatedUnit: Partial<typeof preferredUnits>) => {
        setLocalUnits((prev) => ({ ...prev, ...updatedUnit }));
        setBannerVisible(true)
    };

    const handleHsdChange = (value) => {
        setLocalHsd(value)
        setBannerVisible(true)
    }

    const handleSave = () => {
        setPreferredUnits(localUnits);
        homeScreenDistanceStep.setAsPref(localHsd);
        setBannerVisible(false);
    };

    const handleDiscard = () => {
        setLocalUnits(preferredUnits);
        setLocalHsd(homeScreenDistanceStep.asPref);
        setBannerVisible(false);
    };

    return (
        <Surface style={styles.container} elevation={0}>
            <SettingsSaveBanner
                visible={bannerVisible}
                onSubmit={handleSave}
                onDismiss={handleDiscard}
                error={hsdError}
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
                            dimension={homeScreenDistanceStep}
                            value={localHsd}
                            onValueChange={handleHsdChange}
                            onError={setHsdError}
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