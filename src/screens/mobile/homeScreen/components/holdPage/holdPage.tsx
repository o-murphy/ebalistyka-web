import { Surface } from "react-native-paper"
import HoldReticleContainer from "../holdReticleContainer/holdReticleContainer"
import HoldValuesContainer from "../holdValuesContainer/holdValuesContainer"



const HoldPage = ({hold, style}) => {
    return (
        <Surface style={style} elevation={0}>
            <HoldReticleContainer hold={hold} />
            <HoldValuesContainer hold={hold} />
        </Surface>
    )
}


export default HoldPage;