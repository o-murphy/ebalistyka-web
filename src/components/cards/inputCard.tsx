import { Card } from "react-native-paper";
import React, { useState, ReactNode } from "react";
import { StyleSheet } from "react-native";
import { IconButton, Text } from "react-native-paper";

interface InputCardProps {
    children?: ReactNode;
    title?: string;
    expanded?: boolean;
}

const InputCard: React.FC<InputCardProps> = ({ children = null, title = null, expanded = true }) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(expanded);

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <Card mode="elevated" elevation={1} style={styles.card}>
            <Card.Title
                title={
                    <Text variant="bodyLarge" onPress={toggleExpansion}>
                        {title}
                    </Text>
                }
                right={children ? (props) => (
                    <IconButton
                        {...props}
                        style={styles.iconButton}
                        size={20}
                        icon={isExpanded ? "chevron-up" : "chevron-down"}
                        onPress={toggleExpansion}
                    />
                ) : null}
            />

            {isExpanded && (
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

export default InputCard;
