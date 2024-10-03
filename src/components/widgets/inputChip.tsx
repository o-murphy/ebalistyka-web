import { TextInput } from "react-native-paper"
import SimpleDialog from "../dialogs/simpleDialog"
import { StyleProp, ViewStyle } from "react-native"
import React, { ReactNode, useState } from "react";
import { IconSource } from "react-native-paper/src/components/Icon";


export interface TextInputChipProps {
    style?: StyleProp<ViewStyle>;
    text?: any;
    onTextChange?: (text: string) => void;
    icon?: IconSource;
    label?: any;
}


export const TextInputChip: React.FC<TextInputChipProps> = ({
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