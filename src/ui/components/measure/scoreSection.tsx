import { getScoreQuality } from "@domain/measure/score";
import { ResponsiveCenterView, Row, Stack } from "@ui/components/layout";
import { ScoreView } from "@ui/components/scoreView";
import { SecondaryText, TitleText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { colors, ScoreQualityColors } from "@ui/styles/colors";
import { roundedWhiteCardStyle } from "@ui/styles/containerStyles";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import styled from "styled-components/native";

interface ScoreSectionProps {
	label: string;
	score?: number | null;
	color: string;
	style?: StyleProp<ViewStyle>;
}
export const ScoreSection: React.FC<ScoreSectionProps> = ({ score, color, label, style }) => {
	const { formatScoreQuality } = useI18n();

	const scoreQuality = score != undefined ? getScoreQuality(score) : null;

	return (
		<ResponsiveCenterView style={style} maxWidth={175} align="stretch" horizontalPadding={0}>
			<SecondaryText>{label}</SecondaryText>
			<ScoreWrapper align="center" gap={12}>
				<ScoreView value={score ?? undefined} color={color} textColor={colors.textPrimary} />
				<Row align="center" style={{ width: 100 }} justify="center">
					{scoreQuality && <ColoredDot color={ScoreQualityColors[scoreQuality]} />}
					{scoreQuality && <TitleText>{formatScoreQuality(scoreQuality)}</TitleText>}
				</Row>
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
	position: absolute;
	left: 0;
`;
