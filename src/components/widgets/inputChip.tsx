import React, { ReactNode, useState } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { TextInput } from "react-native-paper";
import { IconSource } from "react-native-paper/src/components/Icon";
import { SimpleDialog } from "../dialogs";


export interface TextInputChipProps {
    style?: StyleProp<ViewStyle>;
    text?: any;
    onTextChange?: (text: string) => void;
    icon?: IconSource;
    label?: any;
}


const TextInputChip: React.FC<TextInputChipProps> = ({
    style = null,
    text = "",
    onTextChange = null,
    icon = null,
    label = null,

}): ReactNode => {

    const [curText, setCurText] = useState<string>(text);

    const onAccept = () => onTextChange?.(curText);
    const onDecline = () => onTextChange?.(text)

    return (
        <SimpleDialog
            style={style}
            label={label}
            icon={icon}
            text={text}
            onAccept={onAccept}
            onDecline={onDecline}
        >
            <TextInput
                value={curText}
                onChangeText={setCurText}
                maxLength={50}
            />
        </SimpleDialog>
    )
}

export default TextInputChip;