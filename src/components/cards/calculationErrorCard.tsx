import { Text, useTheme } from "react-native-paper"
import CustomCard from "./customCard";


interface CalculationErrorProps {
    title?: string;
    details?: string;
}


const CalculationErrorCard = ({ title = "Error", details = "Undefined" }: CalculationErrorProps) => {

    const theme = useTheme();

    const fontStyle = {
        color: theme.colors.error
    }

    return (
        <CustomCard
            style={{ backgroundColor: theme.colors.errorContainer, ...fontStyle }}
            title={
                <Text variant="bodyLarge" >
                    {title}
                </Text>
            }>
            <Text style={{ alignSelf: "center", ...fontStyle }} variant="bodyMedium">
                {details || undefined}
            </Text>
        </CustomCard>
    )
}

export default CalculationErrorCard