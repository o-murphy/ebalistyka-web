import { Surface } from "react-native-paper"
import HoldReticleContainer from "../holdReticleContainer/holdReticleContainer"
import HoldValuesContainer from "../holdValuesContainer/holdValuesContainer"
import { StyleSheet } from "react-native"



const HoldPage = ({ hold }) => {
    return (
        <Surface style={styles.container} elevation={0}>
            <HoldReticleContainer hold={hold} />
            <HoldValuesContainer hold={hold} />
        </Surface>
    )
}


const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        paddingHorizontal: 16,
        justifyContent: "space-between",
    },
})


export default HoldPage;