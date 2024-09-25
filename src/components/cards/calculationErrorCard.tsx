import { Text, HelperText } from "react-native-paper"
import CustomCard from "./customCard";
import { useTheme } from "../../context/themeContext";


interface CalculationErrorProps {
    title?: string;
    details?: string;
}


const CalculationErrorCard = ({title = "Error", details = "Undefined"}: CalculationErrorProps) => {

    const {theme} = useTheme();

    return (
        <CustomCard title={<Text variant="bodyLarge" style={{color: theme.colors.error}} >{title}</Text>}>
            <HelperText type={"error"} visible={true}>{details || undefined}</HelperText>
        </CustomCard>
    )
}

export default CalculationErrorCard