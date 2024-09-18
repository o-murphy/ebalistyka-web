import { View, StyleSheet } from "react-native"
import { Text, TextInput } from "react-native-paper"
import DoubleSpinBox from "./doubleSpinBox"


export interface MeasureFormFieldProps {
    key: string
    label: string
    suffix: string
    icon: string
    initialValue: number,
    maxValue: number,
    minValue: number,
    decimals: number
}

const MeasureFormField = ({field}: {field: MeasureFormFieldProps}) => {
    return (
        <View style={styles.row}>
            <Text style={[styles.column, {flex: 1}, styles.label]}>{field.label}</Text>
            <DoubleSpinBox
                key={field.key}
                value={field.initialValue}
                onValueChange={value => console.log(value)}
                fixedPoints={field.decimals}
                min={field.minValue}
                max={field.maxValue}
                step={1}
                style={styles.doubleSpinBox}
                inputProps={{
                    mode: "outlined",
                    dense: true,
                    ...inputStyles,
                    right: <TextInput.Affix text={field.suffix} textStyle={inputSideStyles.affix} />,
                    // left: <TextInput.Icon icon={field.icon} size={iconSize} style={inputSideStyles.icon} />,
                }}
            />
        </View>
    )
}


export const inputStyles = StyleSheet.create({
    style: {  // view box
        height: 24,
    },
    contentStyle: {  // value
        fontSize: 14,
        textAlign: "center"
    },
    outlineStyle: {  // background
    },
    underlineStyle: {
    }
})

export const inputSideStyles = StyleSheet.create({
    affix: {
        fontSize: 14,
    },
    icon: {
    }
})

export const iconSize = 12

export const styles = StyleSheet.create({
    column: {
        flex: 1,
        flexDirection: "row",
        marginHorizontal: 8
    },
    row: {
        flex: 1,
        flexDirection: "row",
        marginVertical: 4,
        alignItems: 'center',
    },
    doubleSpinBox: {
        justifyContent: 'center',
        flex: 2
    },
    nameContainer: {
        flex: 1,
        marginVertical: 4,
    },
    label: {
        fontSize: 14
    }
})

export default MeasureFormField