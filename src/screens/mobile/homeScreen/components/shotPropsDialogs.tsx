import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Button, Dialog, FAB, HelperText, Icon, Portal, Text } from "react-native-paper"
import { useCalculator } from "../../../../context/profileContext"
import { Angular, UNew, Unit, UnitProps } from "js-ballistics/dist/v2"
import { usePreferredUnits } from "../../../../context/preferredUnitsContext"
import { DoubleSpinBox } from "../../../../components/widgets/doubleSpinBox"
import getFractionDigits from "../../../../utils/fractionConvertor"



export const WindSpeedDialog = ({ button }) => {
    const { currentConditions } = useCalculator()
    const { preferredUnits } = usePreferredUnits()
    const [visible, setVisible] = useState(false)

    const label = `${UNew.MPS(currentConditions?.windSpeed).In(preferredUnits.velocity).toFixed(1)} ${UnitProps[preferredUnits.velocity].symbol}`

    const hide = () => setVisible(false)
    const show = () => setVisible(true)

    return (
        <>
            {React.cloneElement(button, { label: label, onPress: show })}
            <Portal>
                <Dialog visible={visible} onDismiss={hide}>
                    <Dialog.Title>Wind speed</Dialog.Title>
                    <Dialog.Content>
                        klaslk
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={hide}>Done</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

        </>
    )
}

export const LookAngleDialog = ({ button }) => {
    const { currentConditions, updateCurrentConditions } = useCalculator()
    const { preferredUnits } = usePreferredUnits()
    const [visible, setVisible] = useState(false)
    const [localValue, setLocalValue] = useState(0)
    const [error, setError] = useState(null)
    const inputRef = useCallback((node) => {
        if (node !== null) {
            node.focus();
        }
    }, [])

    useEffect(() => {
        if (currentConditions) {
            setLocalValue(UNew.Degree(
                currentConditions?.lookAngle ?
                    currentConditions.lookAngle : 0
            ).In(prefUnit))
        }
    }, [currentConditions?.lookAngle])

    const prefUnit = useMemo(() => preferredUnits.angular, [preferredUnits.angular])
    const accuracy = useMemo(() => getFractionDigits(0.1, UNew.Degree(1).In(prefUnit)), [prefUnit])

    const fieldProps = useMemo(() => ({
        fKey: "cZeroWPitch",
        label: "Look angle",
        icon: "angle-acute",
        fractionDigits: accuracy,
        step: 1 / (10 ** accuracy),
        suffix: UnitProps[prefUnit].symbol,
        minValue: UNew.Degree(-90).In(prefUnit),
        maxValue: UNew.Degree(90).In(prefUnit),
    }), [accuracy, prefUnit])

    const label = `${UNew.Degree(currentConditions?.lookAngle).In(preferredUnits.angular).toFixed(0)} ${UnitProps[preferredUnits.angular].symbol}`

    const hideDialog = () => setVisible(false)
    const showDialog = () => {
        if (currentConditions) {
            setLocalValue(UNew.Degree(
                currentConditions?.lookAngle ?
                    currentConditions.lookAngle : 0
            ).In(prefUnit))
        }
        setVisible(true)
    }

    const onSubmit = () => {
        if (!error) {
            updateCurrentConditions({
                lookAngle: new Angular(localValue, prefUnit).In(Unit.Degree)
            })
            hideDialog()
        }
    }

    const onDecline = () => {
        hideDialog()
    }

    return (
        <>
            {React.cloneElement(button, { label: label, onPress: showDialog })}
            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog} style={{ alignSelf: "center", width: "60%" }} >
                    <Dialog.Content style={{ alignItems: "center", justifyContent: "space-around" }}>
                        <Icon size={40} source={"angle-acute"} />
                        <Text variant="bodyLarge" style={{ marginVertical: 8 }} >Look angle</Text>
                        <DoubleSpinBox value={localValue} onValueChange={setLocalValue} onError={setError} {...fieldProps} inputProps={{ ref: inputRef }} />
                        {error && <HelperText type="error" visible={!!error}>
                            {error.message}
                        </HelperText>}
                    </Dialog.Content>
                    <Dialog.Actions>
                        <FAB size="small" icon={"check"} variant={"secondary"} onPress={onSubmit} />
                        <FAB size="small" icon={"close"} variant={"tertiary"} onPress={onDecline} />
                    </Dialog.Actions>
                </Dialog>
            </Portal>

        </>
    )
}

export const TargetDistanceDialog = ({ button }) => {
    const { currentConditions } = useCalculator()
    const { preferredUnits } = usePreferredUnits()
    const [visible, setVisible] = useState(false)

    const label = `${UNew.Meter(currentConditions?.targetDistance).In(preferredUnits.distance).toFixed(0)} ${UnitProps[preferredUnits.distance].symbol}`

    const hideDialog = () => setVisible(false)
    const showDIalog = () => setVisible(true)

    return (
        <>
            {React.cloneElement(button, { label: label, onPress: showDIalog })}
            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog}>
                    <Dialog.Title>Distance</Dialog.Title>
                    <Dialog.Content>
                        klaslk
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={hideDialog}>Done</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

        </>
    )
}