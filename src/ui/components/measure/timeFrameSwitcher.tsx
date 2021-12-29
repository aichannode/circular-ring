import { TimeFrame } from "@domain/measure/type"
import { useI18n } from "@ui/i18n"
import { colors } from "@ui/styles/colors"
import React, { useState } from "react"
import { View } from "react-native"
import { WordingKey } from "src/wordings"
import { SelectableButton } from "../selectableButton"

type Props = {
    frames: Array<{
        /** i18n key */
        label: WordingKey
        /** A ISO string formated duration */
        duration: TimeFrame
    }>
    color: string
}

export function TimeFrameSwitcher({ frames, color }: Props) {
    const [selectedFrame, selectFrame] = useState(frames[0].duration)
    const { format } = useI18n()
    return (
        <View style={{flexDirection: "row", justifyContent: "center"}}>
            {frames.map(({duration, label}) => (
                <SelectableButton
                    key={duration}
                    selected={selectedFrame === duration}
                    style={{ paddingHorizontal: 4 }}
                    onPress={() => selectFrame(duration)}
                    colors={[color, color]}
                    bgColor={colors.lightgray}
                >{format(label)}</SelectableButton>
            ))}
        </View>
    )
}