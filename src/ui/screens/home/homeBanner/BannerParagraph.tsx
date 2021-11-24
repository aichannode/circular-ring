import { ParagraphComponentConfigurationDto, ParagraphStyle } from "@domain/homeBanner/homeBanner";
import { SecondaryText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import React from "react";
import { ColorValue } from "react-native";

type Props = ParagraphComponentConfigurationDto["configuration"] & {
    /**
     * Set to true when used on dark background
     */
    useContrastColor?: boolean
    /**
     * Set te color which will be used for <colored/> tag
     */
    coloredTagColor?: ColorValue
}


function getTextColor(style: ParagraphStyle, useContrastColor?: boolean) {
    switch(style) {
        default: return useContrastColor
            ? colors.white
            : colors.textPrimary
    }
}

function BannerParagraph({coloredTagColor, translationKey, style, properties, useContrastColor}: Props) {
    const { format } = useI18n({color: coloredTagColor})

    return (
        <SecondaryText style={{color: getTextColor(style, useContrastColor)}}>
            {format(translationKey, properties)}
        </SecondaryText>
    )
}

export default BannerParagraph