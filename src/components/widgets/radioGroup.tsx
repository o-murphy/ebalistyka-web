import React, {useState} from "react";
import { RadioButton } from "react-native-paper";

type RadioItem = {
    label: string
    key: any
    value: any
}


type RadioProps = {
    initialValue: any
    onChange: Function|any
    items: RadioItem[]
}


export default function RadioGroup({initialValue, onChange, items}: RadioProps) {

    const [value, setValue] = useState(initialValue);

    const onValueChange = (value: string) => {
        setValue(value);
        if (onChange) onChange(value);
    }

    return (
            <RadioButton.Group onValueChange={onValueChange} value={value}>
                {items.map(item =>
                        <RadioButton.Item key={item.value} label={item.label} value={item.value}/>
                )}
            </RadioButton.Group>
    );

}