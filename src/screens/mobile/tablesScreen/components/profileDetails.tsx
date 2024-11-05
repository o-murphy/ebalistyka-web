import { View } from "react-native"
import { Chip, Divider, List, Text, useTheme } from "react-native-paper"
import { useCalculator } from "../../../../context/profileContext"
import { usePreferredUnits } from "../../../../context/preferredUnitsContext"
import { UNew, Unit, UnitProps } from "js-ballistics/dist/v2"
import getFractionDigits from "../../../../utils/fractionConvertor"


export const Section = ({ text, value, divider = true }) => {
    return (
        <View>
            <View style={{ flexDirection: "row", marginVertical: 4, justifyContent: "space-between" }}>
                <View style={{ justifyContent: "center", flex: 2 }}>
                    <Text variant={"labelMedium"}>
                        {text}
                    </Text>
                </View>
                <Chip style={{ flex: 1 }}>
                    <Text variant={"labelMedium"}>
                        {value}
                    </Text>
                </Chip>
            </View>
            {divider && <Divider style={{ marginVertical: 4 }} />}
        </View>
    )
}

export const SectionTitle = ({ title }) => {
    return (
        <View style={{ marginTop: 16, marginBottom: 4, justifyContent: "center" }}>

            <Text variant={"labelLarge"} style={{ flex: 1, textAlign: "center" }}>
                {title}
            </Text>
        </View>
    )
}


export const SectionSubtitle = ({ subtitle }) => {
    const theme = useTheme()

    return (
        <View style={{ marginTop: 16, marginBottom: 4, justifyContent: "center" }}>

            <Text
                variant={"labelSmall"}
                style={{ flex: 1, textAlign: "center", color: theme.colors.secondary }}
            >
                {subtitle}
            </Text>
        </View>
    )
}


const BCDetails = ({ dragModel, coeffs }) => {
    const { preferredUnits } = usePreferredUnits()
    const theme = useTheme()

    if (dragModel === "G1" || dragModel === "G7") {
        const bcOrCustom = "Ballistic coefficients"
        const coeffRows = coeffs.map((item, index) => {
            const v = `${UNew.MPS(item.mv / 10).In(preferredUnits.velocity).toFixed(0)} ${UnitProps[preferredUnits.velocity].symbol}`
            const bc = (item.bcCd / 10000).toFixed(3)
            return <Section key={index} text={v} value={bc} divider={index !== coeffs.length - 1} />
        })
        return (


            <View style={{ flexDirection: "column" }}>
                <Section text={"Drag model"} value={dragModel} divider={false} />
                <View style={{
                    borderRadius: 16,
                    backgroundColor: theme.colors.elevation.level4,
                    overflow: "hidden",
                    marginVertical: 4
                }}>
                    <List.Accordion 
                        title={"Ballistic coefficients"}
                        titleStyle={{fontSize: 12}}
                        style={{
                            paddingVertical: 0,
                            marginVertical: 0,
                            backgroundColor: theme.colors.elevation.level4,
                        }}
                    >
                        <View style={{
                            flexDirection: "column",
                            marginHorizontal: 32,
                            paddingBottom: 16,
                        }}>
                            {coeffRows}
                        </View>
                    </List.Accordion>
                </View>
            </View>
        )
    } else {
        const bcOrCustom = "Custom drag function uses"
        return (
            <View style={{ flexDirection: "column" }}>
                <Section text={"Drag model"} value={dragModel} divider={false} />
                <SectionSubtitle subtitle={bcOrCustom} />
            </View>
        )
    }


}

export const ProfileDetails = () => {

    const { preferredUnits } = usePreferredUnits()
    const { profileProperties, currentConditions } = useCalculator()
    const theme = useTheme()

    const caliberAccuracy = getFractionDigits(0.001, UNew.Inch(1).In(preferredUnits.sizes))
    const twistAccuracy = getFractionDigits(0.1, UNew.Inch(1).In(preferredUnits.sizes))
    const bLengthAccuracy = getFractionDigits(0.01, UNew.Inch(1).In(preferredUnits.sizes))
    const bWeightAccuracy = getFractionDigits(0.1, UNew.Grain(1).In(preferredUnits.weight))
    const windSpeedAccuracy = getFractionDigits(0.1, UNew.MPS(1).In(preferredUnits.velocity))

    const props = {
        profName: profileProperties?.profileName,
        caliber: `${UNew.Inch(profileProperties?.bDiameter / 1000).In(preferredUnits.sizes).toFixed(caliberAccuracy)} ${UnitProps[preferredUnits.sizes].symbol}`,
        twist: `1:${UNew.Inch(profileProperties?.rTwist / 100).In(preferredUnits.sizes).toFixed(twistAccuracy)} ${UnitProps[preferredUnits.sizes].symbol}`,
        twistDir: profileProperties?.twistDir,
        dragModel: profileProperties?.bcType,
        mv: `${UNew.MPS(profileProperties?.cMuzzleVelocity / 10).In(preferredUnits.velocity).toFixed(0)} ${UnitProps[preferredUnits.velocity].symbol}`,
        zeroDist: `${UNew.Meter(profileProperties?.distances[profileProperties?.cZeroDistanceIdx] / 100).In(preferredUnits.distance).toFixed(0)} ${UnitProps[preferredUnits.distance].symbol}`,
        bLength: `${UNew.Inch(profileProperties?.bLength / 1000).In(preferredUnits.sizes).toFixed(bLengthAccuracy)} ${UnitProps[preferredUnits.sizes].symbol}`,
        bWeight: `${UNew.Grain(profileProperties?.bWeight / 10).In(preferredUnits.weight).toFixed(bWeightAccuracy)} ${UnitProps[preferredUnits.weight].symbol}`,
        scHeight: `${UNew.Centimeter(profileProperties?.scHeight / 10).In(preferredUnits.sizes).toFixed(twistAccuracy)} ${UnitProps[preferredUnits.sizes].symbol}`,

        coeffs: profileProperties?.coefRows,

        bulletName: profileProperties?.bulletName
    }

    const conds = {
        temp: `${UNew.Celsius(currentConditions?.temperature).In(preferredUnits.temperature).toFixed(0)} ${UnitProps[preferredUnits.temperature].symbol}`,
        press: `${UNew.hPa(currentConditions?.pressure).In(preferredUnits.pressure).toFixed(0)} ${UnitProps[preferredUnits.pressure].symbol}`,
        humidity: `${currentConditions?.humidity} %`,
        windSpeed: `${UNew.MPS(currentConditions?.windSpeed).In(preferredUnits.velocity).toFixed(windSpeedAccuracy)}  ${UnitProps[preferredUnits.velocity].symbol}`,
        windDir: `${(currentConditions?.windDirection * 30).toFixed(0)} ${UnitProps[Unit.Degree].symbol}`,
    }

    return (
        <List.Section style={{
            paddingVertical: 0,
            marginVertical: 0,
            backgroundColor: theme.colors.elevation.level1,
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
        }}>
            {/* <List.Accordion title={<Text variant="labelMedium">{"Profile details"}</Text>} */}
            <List.Accordion title={"Profile details"}
                style={{
                    paddingVertical: 0,
                    marginVertical: 0,
                    backgroundColor: theme.colors.elevation.level1,
                }}
            >

                <View style={{
                    flexDirection: "column", 
                    marginHorizontal: 16, 
                    paddingBottom: 16,
                }}>
                    <Section text={"Profile name"} value={props.profName} />

                    <SectionTitle title={"Weapon"} />
                    <Section text={"Caliber"} value={props.caliber} />
                    <Section text={"Twist"} value={props.twist} />
                    <Section text={"Twist direction"} value={props.twistDir} />

                    <SectionTitle title={"Projectile"} />
                    <SectionSubtitle subtitle={props.bulletName} />
                    <BCDetails dragModel={props.dragModel} coeffs={props.coeffs} />

                    <Section text={"Muzzle velocity"} value={"<mv>"} />
                    <Section text={"Zero muzzle velocity"} value={props.mv} />
                    <Section text={"Zero distance"} value={props.zeroDist} />
                    <Section text={"Bullet length"} value={props.bLength} />
                    <Section text={"Bullet diameter"} value={props.caliber} />
                    <Section text={"Bullet weight"} value={props.bWeight} />

                    <SectionTitle title={"Scope"} />
                    <Section text={"Sight height"} value={props.scHeight} />

                    <SectionTitle title={"Atmosphere"} />
                    <Section text={"Temperature"} value={conds.temp} />
                    <Section text={"Humidity"} value={conds.humidity} />
                    <Section text={"Pressure"} value={conds.press} />
                    <Section text={"Wind speed"} value={conds.windSpeed} />
                    <Section text={"Wind direction"} value={conds.windDir} divider={false} />

                </View>

            </List.Accordion>
            {/* <Divider /> */}

        </List.Section>
    )
}