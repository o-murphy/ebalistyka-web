import { StyleSheet, View } from "react-native"
import { Dialog, FAB, Portal, useTheme } from "react-native-paper"
import { Table, Row } from 'react-native-table-component';


export const RowDetailsDialog = ({ row, visible, setVisible }) => {
    const theme = useTheme()

    if (!row) {
        return null
    }

    const [time, distance, velocity, height, ...rest] = row


    const hideDialog = () => {
        setVisible(false)
    }

    const styles = StyleSheet.create({
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
            <Dialog visible={visible} onDismiss={hideDialog} style={{ alignSelf: "center", width: 250 }}>
                <Dialog.Title>{distance}</Dialog.Title>
                <Dialog.Content style={{ alignItems: "center", justifyContent: "center" }}>
                    <View style={{ minWidth: "100%" }}>

                        <Table borderStyle={styles.borderStyle} style={styles.table}>
                            <Row
                                data={["Time:", time]}
                                textStyle={styles.text}
                                style={styles.row}
                            />
                            <Row
                                data={["Distance:", distance]}
                                textStyle={styles.text}
                                style={styles.row}
                            />
                            <Row
                                data={["Velocity:", velocity]}
                                textStyle={styles.text}
                                style={styles.row}
                            />
                            <Row
                                data={["Height:", height]}
                                textStyle={styles.text}
                                style={styles.row}
                            />
                            <Row
                                data={["Placeholder:", "<NaN>"]}
                                textStyle={styles.text}
                                style={styles.row}
                            />
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