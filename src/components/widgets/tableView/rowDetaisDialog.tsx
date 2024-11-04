import { StyleSheet, View } from "react-native"
import { Dialog, FAB, Portal, useTheme } from "react-native-paper"
import { Table, Row } from 'react-native-table-component';
import { usePreferredUnits } from "../../../context/preferredUnitsContext";
import { UnitProps } from "js-ballistics/dist/v2";
import React from "react";


interface RowDetailsProps {
    row?: string[];
    visible?: boolean;
    setVisible?: (v: boolean) => void; 
}


export const RowDetailsDialog: React.FC<RowDetailsProps> = ({ row, visible, setVisible }) => {
    const theme = useTheme()
    const { preferredUnits } = usePreferredUnits()

    if (!row) {
        return null
    }

    const [
        time, distance, velocity, 
        height, drop, targetDrop,
        windage, windageAdjustment,
        mach, drag, energy, ...rest
    ] = row

    const rows = [
        [
            "Time:",
            `${time} s`
        ],
        [
            "Distance:",
            `${distance} ${UnitProps[preferredUnits.distance].symbol}`
        ],
        [
            "Velocity:",
            `${velocity} ${UnitProps[preferredUnits.velocity].symbol}`
        ],
        [
            "Height:",
            `${height} ${UnitProps[preferredUnits.drop].symbol}`
        ],
        [
            "Drop:",
            `${drop} ${UnitProps[preferredUnits.drop].symbol}`
        ],
        [
            "Drop adj.:",
            `${targetDrop} ${UnitProps[preferredUnits.adjustment].symbol}`
        ],
        [
            "Windage:",
            `${windage} ${UnitProps[preferredUnits.drop].symbol}`
        ],
        [
            "Windage adj.:",
            `${windageAdjustment} ${UnitProps[preferredUnits.adjustment].symbol}`
        ],
        [
            "Mach:",
            `${mach}`
        ],
        [
            "Drag:",
            `${drag}`
        ],
        [
            "Energy:",
            `${energy} ${UnitProps[preferredUnits.energy].symbol}`
        ],
    ]


    const hideDialog = () => {
        setVisible(false)
    }

    const styles = StyleSheet.create({
        noSelect: {
            userSelect: 'none', // This will prevent text selection on web
        },
        table: {
            // backgroundColor: '#00f' 
        },  // Ensures the table fills the parent width if the parent is wider

        borderStyle: {
            // borderWidth: 2, 
            borderColor: theme.colors.surfaceVariant
        },

        text: {
            textAlign: 'left',
            color: theme.colors.onSurfaceVariant
        },
        row: { height: 20, },
    });

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={hideDialog} style={{ alignSelf: "center", width: 250, ...styles.noSelect }}>
                <Dialog.Title>Details: {distance} {UnitProps[preferredUnits.distance].symbol}</Dialog.Title>
                <Dialog.Content style={{ alignItems: "center", justifyContent: "center" }}>
                    <View style={{ minWidth: "100%" }}>

                        <Table borderStyle={styles.borderStyle} style={styles.table}>
                            {rows.map(row => <Row
                                data={row}
                                textStyle={styles.text}
                                style={styles.row}
                            />)}
                        </Table>

                    </View>
                </Dialog.Content>
                <Dialog.Actions>
                    <FAB size="small" icon="close" variant="tertiary" onPress={hideDialog} />
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}

const styles = StyleSheet.create({
    column: {
        flex: 1,
        flexDirection: "column"
    },
    row: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between"
    }
})