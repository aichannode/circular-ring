import { ParagraphComponentConfigurationDto, ParagraphStyle } from "@domain/homeBanner/homeBanner";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import React from "react";
import { ColorValue } from "react-native";
import styled from "styled-components/native";

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

const Text = styled.Text<{style: ParagraphStyle, useContrastColor?: boolean}>`
    font-size: 14px;
    color: ${({style, useContrastColor}) => {
        switch(style) {
            default: return useContrastColor
                ? colors.white
                : colors.textPrimary
        }
    }}
`;

function BannerParagraph({coloredTagColor, translationKey, style, properties, useContrastColor}: Props) {
    const { format } = useI18n({color: coloredTagColor})

    return (
        <Text
            style={style}
            useContrastColor={useContrastColor}
        >
            {format(translationKey, properties)}
        </Text>
    )
}

export default BannerParagraph