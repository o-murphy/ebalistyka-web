import { View } from "react-native"
import { Chip, Divider, List, Text } from "react-native-paper"
import { useCalculator } from "../../../../context/profileContext"
import { usePreferredUnits } from "../../../../context/preferredUnitsContext"
import { Distance, UNew, UnitProps } from "js-ballistics/dist/v2"
import getFractionDigits from "../../../../utils/fractionConvertor"


export const Section = ({ text, value }) => {
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
            <Divider style={{ marginVertical: 4 }} />
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

export const ProfileDetails = () => {

    const { preferredUnits } = usePreferredUnits()
    const { profileProperties, currentConditions } = useCalculator()

    const caliberAccuracy = getFractionDigits(0.001, UNew.Inch(1).In(preferredUnits.sizes))
    const twistAccuracy = getFractionDigits(0.1, UNew.Inch(1).In(preferredUnits.sizes))
    const bLengthAccuracy = getFractionDigits(0.01, UNew.Inch(1).In(preferredUnits.sizes))
    const bWeightAccuracy = getFractionDigits(0.1, UNew.Grain(1).In(preferredUnits.weight))

    const values = {
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
    }

    return (
        <List.Section>
            <List.Accordion title={"Details"} >
                <View style={{ flexDirection: "column", marginHorizontal: 16 }}>
                    <Section text={"Profile name"} value={values.profName} />

                    <SectionTitle title={"Weapon"} />
                    <Section text={"Caliber"} value={values.caliber} />
                    <Section text={"Twist"} value={values.twist} />
                    <Section text={"Twist direction"} value={values.twistDir} />

                    <SectionTitle title={"Projectile"} />
                    <Section text={"Drag model"} value={values.dragModel} />
                    <Section text={"BC"} value={"<bc>"} />
                    <Section text={"Muzzle velocity"} value={"<mv>"} />
                    <Section text={"Zero muzzle velocity"} value={values.mv} />
                    <Section text={"Zero distance"} value={values.zeroDist} />
                    <Section text={"Bullet length"} value={values.bLength} />
                    <Section text={"Bullet diameter"} value={values.caliber} />
                    <Section text={"Bullet weight"} value={values.bWeight} />

                    <SectionTitle title={"Scope"} />
                    <Section text={"Sight height"} value={values.scHeight} />

                    <SectionTitle title={"Atmosphere"} />
                    <Section text={"Temperature"} value={"<temp>"} />
                    <Section text={"Humidity"} value={"<humidity>"} />
                    <Section text={"Pressure"} value={"<pressure>"} />
                    <Section text={"Wind speed"} value={"<wind speed>"} />
                    <Section text={"Wind direction"} value={"<wind direction>"} />

                </View>

            </List.Accordion>
        </List.Section>
    )
}