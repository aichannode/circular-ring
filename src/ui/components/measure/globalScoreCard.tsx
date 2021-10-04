import { getScoreQuality } from "@domain/measure/score";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { roundedWhiteCardStyle } from "@ui/styles/containerStyles";
import React from "react";
import { StyleProp, ViewStyle, View } from "react-native";
import styled from "styled-components/native";
import { Row } from "../layout";
import { ScoreView } from "../scoreView";
import { SecondaryText, TitleText } from "../text";

interface GlobalScoreCardProps {
	score: number | null;
	style?: StyleProp<ViewStyle>;
}
const goodGlobalScoreThreshold = 80;
const optimalGlobalScoreThreshold = 90;
export const GlobalScoreCard: React.FC<GlobalScoreCardProps> = ({ score, style }) => {
	const { format, formatScoreQuality } = useI18n();

	const scoreQuality = score ? getScoreQuality(score, goodGlobalScoreThreshold, optimalGlobalScoreThreshold) : null;

	return (
		<Container gap={16} align="center" justify="center" style={style}>
			<ScoreView value={score ?? undefined} color={colors.primary} />
			<View>
				<SecondaryText>{format("profile.global_score.label")}</SecondaryText>
				{scoreQuality && <TitleText style={{ color: colors.primary }}>{formatScoreQuality(scoreQuality)}</TitleText>}
			</View>
		</Container>
	);
};

const Container = styled(Row)`
	${roundedWhiteCardStyle};
	padding: 25px;
`;
