import { View } from "react-native"
import { Chip, Divider, List, Text, Surface, useTheme } from "react-native-paper"
import { useProfile } from "../../../../context/profileContext"
import { usePreferredUnits } from "../../../../context/preferredUnitsContext"
import { HitResult, UNew, UnitProps } from "js-ballistics/dist/v2"
import { useCurrentConditions } from "../../../../context/currentConditions"
import { useCalculator } from "../../../../context/calculatorContext"
import { dimensions, useDimension } from "../../../../hooks/dimension"
import { useEffect, useMemo } from "react"


const Section = ({ text, value, divider = true }) => {
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

const SectionTitle = ({ title }) => {
    return (
        <View style={{ marginTop: 16, marginBottom: 4, justifyContent: "center" }}>

            <Text variant={"labelLarge"} style={{ flex: 1, textAlign: "center" }}>
                {title}
            </Text>
        </View>
    )
}


const SectionSubtitle = ({ subtitle }) => {
    return (
        <View style={{ marginTop: 16, marginBottom: 4, justifyContent: "center" }}>

            <Text
                variant={"labelSmall"}
                style={{ flex: 1, textAlign: "center", }}
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
        const coeffRows = coeffs.map((item, index) => {
            const v = `${UNew.MPS(item.mv / 10).In(preferredUnits.velocity).toFixed(0)} ${UnitProps[preferredUnits.velocity].symbol}`
            const bc = (item.bcCd / 10000).toFixed(3)
            return <Section key={index} text={v} value={bc} divider={index !== coeffs.length - 1} />
        })
        return (


            <Surface style={{ flexDirection: "column" }} elevation={0}>
                <Section text={"Drag model"} value={dragModel} divider={false} />
                <Surface style={{
                    borderRadius: 16,
                    overflow: "hidden",
                    marginVertical: 4
                }}
                    elevation={3}>
                    <List.Accordion
                        title={"Ballistic coefficients"}
                        titleStyle={{ fontSize: 12 }}
                        style={{
                            paddingVertical: 0,
                            marginVertical: 0,
                            backgroundColor: theme.colors.elevation.level3,
                        }}
                    >
                        <Surface style={{
                            flexDirection: "column",
                            marginHorizontal: 32,
                            paddingBottom: 16,
                        }} elevation={0}>
                            {coeffRows}
                        </Surface>
                    </List.Accordion>
                </Surface>
            </Surface>
        )
    } else {
        const bcOrCustom = "Custom drag function uses"
        return (
            <Surface style={{ flexDirection: "column" }} elevation={0}>
                <Section text={"Drag model"} value={dragModel} divider={false} />
                <SectionSubtitle subtitle={bcOrCustom} />
            </Surface>
        )
    }


}

const ProfileDetails = () => {

    const theme = useTheme()
    const { hitResult } = useCalculator()
    const profileProperties = useProfile()
    const currentConditions = useCurrentConditions()

    const currentMv = useDimension(dimensions.cMuzzleVelocity)

    useEffect(() => {
        if (hitResult instanceof HitResult) {
            currentMv.setValue(hitResult.trajectory[0].velocity)
        }
    }, [hitResult])

    const [props, conds] = useMemo(() => {
        return [{
            profName: profileProperties.profileProperties.profileName,
            caliber: `${profileProperties.bDiameter.asString} ${profileProperties.bDiameter.symbol}`,
            twist: `1:${profileProperties.rTwist.asString} ${profileProperties.rTwist.symbol}`,
            twistDir: profileProperties.profileProperties.twistDir,
            dragModel: profileProperties.profileProperties.bcType,
            zeroMv: `${profileProperties.cMuzzleVelocity.asString} ${profileProperties.cMuzzleVelocity.symbol}`,
            zeroDist: `${profileProperties.zeroDistance.asString} ${profileProperties.zeroDistance.symbol}`,
            bLength: `${profileProperties.bLength.asString} ${profileProperties.bLength.symbol}`,
            bWeight: `${profileProperties.bWeight.asString} ${profileProperties.bWeight.symbol}`,
            scHeight: `${profileProperties.scHeight.asString} ${profileProperties.scHeight.symbol}`,
            coeffs: profileProperties.profileProperties.coefRows,
            bulletName: profileProperties.profileProperties.bulletName,
            currentMv: `${currentMv.asString} ${currentMv.symbol}`
        }, {
            temp: `${currentConditions.temperature.asString} ${currentConditions.temperature.symbol}`,
            press: `${currentConditions.pressure.asString} ${currentConditions.pressure.symbol}`,
            humidity: `${currentConditions.flags?.humidity} %`,
            windSpeed: `${currentConditions.windSpeed.asPref}  ${currentConditions.windSpeed.symbol}`,
            windDir: `${currentConditions.windDirection.asDef.toFixed(0)} °`,
        }]
    }, [hitResult])

    return (
        <Surface style={{
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            overflow: "hidden",
        }}
            elevation={2}>
            <List.Section
                style={{
                    paddingVertical: 0,
                    marginVertical: 0,
                }}>
                <List.Accordion title={"Profile details"}
                    titleStyle={{
                        backgroundColor: "transparent",
                    }}
                    style={{
                        paddingVertical: 0,
                        marginVertical: 0,
                        backgroundColor: theme.colors.elevation.level2,
                    }}
                >
                    <Surface
                        style={{
                            flexDirection: "column",
                            paddingHorizontal: 16,
                            paddingBottom: 16,
                        }}
                        elevation={2}
                    >
                        <Section text={"Profile name"} value={props.profName} />

                        <SectionTitle title={"Weapon"} />
                        <Section text={"Caliber"} value={props.caliber} />
                        <Section text={"Twist"} value={props.twist} />
                        <Section text={"Twist direction"} value={props.twistDir} />

                        <SectionTitle title={"Projectile"} />
                        <SectionSubtitle subtitle={props.bulletName} />
                        <BCDetails dragModel={props.dragModel} coeffs={props.coeffs} />

                        <Section text={"Muzzle velocity"} value={props.currentMv} />
                        <Section text={"Zero muzzle velocity"} value={props.zeroMv} />
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

                    </Surface>

                </List.Accordion>
            </List.Section>
        </Surface>
    )
}


export default ProfileDetails;