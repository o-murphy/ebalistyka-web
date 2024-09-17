import { Card } from "react-native-paper";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { IconButton, Text } from "react-native-paper";



const InputCard = ({ children, title, expanded = true }) => {

    const [isExpanded, setIsExpanded] = useState(expanded);

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded)
    }

    return (
        <Card mode="elevated" elevation={1}
            style={{ ...styles.card }}
        >
            <Card.Title
                style={styles.title}
                titleStyle={styles.titleFont}
                titleVariant={"titleLarge"}
                title={title}
                right={(props) =>
                    <IconButton {...props}
                        style={styles.iconButton}
                        size={20}
                        icon={isExpanded ? "chevron-up" : "chevron-down"}
                        onPress={toggleExpansion}
                    />}
            />

            {isExpanded && (
                <Card.Content
                    style={styles.content}
                >
                    {children}
                </Card.Content>
            )}

        </Card>
    )
}


const styles = StyleSheet.create({
    card: {
        margin: 15,
        padding: 10,
        flexGrow: 0
    },
    iconButton: {
        marginVertical: 0,  // Reduce vertical margin of the IconButton
        paddingVertical: 0,  // Remove extra padding
    },
    title: {
        marginVertical: 0,  // Reduce vertical margin of the IconButton
        paddingVertical: 0,  // Remove extra padding
    },
    titleFont: {
        fontSize: 20
    },
    content: {
    },
})

export default InputCard;