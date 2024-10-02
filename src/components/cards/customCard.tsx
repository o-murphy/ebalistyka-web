import { Card } from "react-native-paper";
import { useState, ReactNode, isValidElement } from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { IconButton, Text } from "react-native-paper";

interface CustomCardProps {
    children?: ReactNode;
    title?: string|ReactNode;
    style?: StyleProp<ViewStyle>
    expanded?: boolean;
    iconButton?: ReactNode;
}

const CustomCard: React.FC<CustomCardProps> = ({ children = null, title = null, style = null, expanded = true, iconButton = null }) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(expanded);

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
    };

    const _title = isValidElement(title) ? (
        title
    ) : (
        <Text variant="bodyLarge" onPress={toggleExpansion}>
            {title}
        </Text>
    )

    return (
        <Card mode="elevated" elevation={1} style={[styles.card, style]}>
            <Card.Title
                title={_title}
                right={children ? (props) => (
                    iconButton ?? <IconButton
                        {...props}
                        style={styles.iconButton}
                        size={20}
                        icon={isExpanded ? "chevron-up" : "chevron-down"}
                        onPress={toggleExpansion}
                    />
                ) : null}
            />

            {isExpanded && children && (
                <Card.Content style={styles.content}>
                    {children}
                </Card.Content>
            )}
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginTop: 15,
        marginHorizontal: 15,
    },
    iconButton: {},
    title: {},
    titleStyle: {},
    titleFont: {},
    content: {},
});

export default CustomCard;
