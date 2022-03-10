import { ScoreQuality } from "@domain/measure/representation/api";
import { ResponsiveCenterView, Stack } from "@ui/components/layout";
import { ScoreView } from "@ui/components/scoreView";
import { SecondaryText, TitleText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { colors, ScoreQualityColors } from "@ui/styles/colors";
import { roundedWhiteCardStyle } from "@ui/styles/containerStyles";
import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import styled from "styled-components/native";

interface ScoreSectionProps {
	isDisabled: boolean;
	label: string;
	quality: ScoreQuality;
	score: number;
	color: string;
	style?: StyleProp<ViewStyle>;
}
export const ScoreSection: React.FC<ScoreSectionProps> = ({ score, color, label, style, isDisabled, quality }) => {
	const { format, formatScoreQuality } = useI18n();

	return (
		<ResponsiveCenterView style={style} maxWidth={175} align="stretch" horizontalPadding={0}>
			<SecondaryText>{label}</SecondaryText>
			<ScoreWrapper align="center" gap={12}>
				<ScoreView value={score} color={color} textColor={colors.textPrimary} />
				<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
					{!isDisabled && <ColoredDot color={ScoreQualityColors[quality]} />}
					{isDisabled ? (
						<TitleText style={{ color }}> {format("global.not_enough_data")}</TitleText>
					) : (
						<TitleText>{formatScoreQuality(quality)}</TitleText>
					)}
				</View>
			</ScoreWrapper>
		</ResponsiveCenterView>
	);
};

const ScoreWrapper = styled(Stack)`
	${roundedWhiteCardStyle};
	margin-top: 15px;
	padding-vertical: 30px;
`;

const ColoredDot = styled.View<{ color: string }>`
	flex-grow: 0;
	flex-shrink: 0;
	width: 10px;
	height: 10px;
	border-radius: 5px;
	background-color: ${({ color }) => color};
	margin-right: 10px;
`;
