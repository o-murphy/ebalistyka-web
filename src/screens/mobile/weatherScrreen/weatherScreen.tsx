import { ScreenBackground } from "../components";
import { WeatherContainer } from "../../../components/containers/weatherContainer";

const WeatherScreen = ({ navigation }) => {
    return (
        <ScreenBackground>
            <WeatherContainer />
        </ScreenBackground>
    )
}


export default WeatherScreen;