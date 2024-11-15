import { Card } from "react-native-paper";
import { ReactNode, isValidElement } from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { Text } from "react-native-paper";

interface CustomCardProps {
    children?: ReactNode;
    title?: string|ReactNode;
    style?: StyleProp<ViewStyle>;
}

const CustomCard: React.FC<CustomCardProps> = ({ children = null, title = null, style = null }) => {

    const _title = isValidElement(title) ? (
        title
    ) : (
        <Text variant="bodyLarge">
            {title}
        </Text>
    )

    return (
        <Card mode="elevated" elevation={1} style={[styles.card, style]}>
            <Card.Title
                title={_title}
                style={styles.title}
                titleStyle={styles.title}
            />

            {children && (
                <Card.Content style={styles.content}>
                    {children}
                </Card.Content>
            )}
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        minWidth: 360,
        margin: 8,
    },
    iconButton: {},
    title: {},
    titleStyle: {},
    titleFont: {},
    content: {},
});

export default CustomCard;
