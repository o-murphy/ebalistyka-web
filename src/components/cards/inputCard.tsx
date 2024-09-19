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
                title={title}
                // style={styles.title}
                // titleVariant={"bodyLarge"}
                // titleStyle={styles.titleStyle}
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
        marginTop: 15,
        marginHorizontal: 15
    },
    iconButton: {
    },
    title: {
    },
    titleStyle: {
    },
    titleFont: {
    },
    content: {
    },
})

export default InputCard;