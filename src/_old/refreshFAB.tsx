import { StyleProp, ViewStyle } from "react-native";
import { CalculationState, useProfile } from "../../context/profileContext";
import { FAB, Tooltip } from "react-native-paper";
import React from "react";


export enum RefreshFabState {
    Actual = 1,
    Updated = 2,
    Error = 3
}

export interface RefreshFabProps {
    state?: RefreshFabState,
    style?: StyleProp<ViewStyle>
}

export const RefreshFAB: React.FC<RefreshFabProps> = ({ state = RefreshFabState.Actual, style = null }) => {
    const { fire, calcState, setCalcState } = useProfile()

    const onPress = () => {
        if (state !== RefreshFabState.Error && calcState !== CalculationState.Error) {
            return fire()
        } else {
            return setCalcState(CalculationState.InvalidData)
        }
    }

    return (
        <Tooltip
            title={state === RefreshFabState.Updated ? "Recalculate" : "Invalid value"}
            enterTouchDelay={0}
            leaveTouchDelay={0}
        >
            <FAB
                visible={state !== RefreshFabState.Actual}
                style={style}
                size={"small"}
                icon={state === RefreshFabState.Updated ? "reload" : "alert"}
                onPress={onPress}
                variant="tertiary"
            />
        </Tooltip>
    )
}