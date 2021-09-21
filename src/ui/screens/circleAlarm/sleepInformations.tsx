import { getScoreQuality } from "@domain/circleActivity/circleActivityData";
import { ResponsiveCenterView, Row, Stack } from "@ui/components/layout";
import { ScoreView } from "@ui/components/scoreView";
import { SecondaryText, TitleText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { colors, qualityColors } from "@ui/styles/colors";
import { roundedWhiteCardStyle } from "@ui/styles/containerStyles";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import styled from "styled-components/native";

const FAKE_sleepScore = 89;

interface SleepInformationsProps {
	style?: StyleProp<ViewStyle>;
}
export const SleepInformations: React.FC<SleepInformationsProps> = ({ style }) => {
	const { format, formatScoreQuality } = useI18n();

	const sleepScoreQuality = getScoreQuality(FAKE_sleepScore, 80, 90);

	return (
		<ResponsiveCenterView style={style} maxWidth={175} align="stretch" horizontalPadding={0}>
			<SecondaryText>{format("alarm.wake_up_score")}</SecondaryText>
			<ScoreWrapper align="center" gap={12}>
				<ScoreView value={FAKE_sleepScore} color={colors.blue} />
				<Row align="center" style={{ width: 100 }} justify="center">
					<ColoredDot color={qualityColors[sleepScoreQuality]} />
					<TitleText>{formatScoreQuality(sleepScoreQuality)}</TitleText>
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
