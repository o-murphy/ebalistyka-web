import {Card} from "react-native-paper";
import React from "react";
import styleSheet from "../../stylesheet";



const InputCard = ({children, title}) => {

    return (
        <Card mode="elevated" elevation={1}
              style={[styleSheet.card.card]}
        >
            <Card.Title titleVariant={"titleLarge"} title={title}></Card.Title>
            <Card.Content 
            style={styleSheet.card.content}
            >
                {children}
            </Card.Content>
        </Card>
    )
}


export default InputCard;