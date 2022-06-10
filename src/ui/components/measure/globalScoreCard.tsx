import { ScoreQuality } from "@domain/measure/representation/api";
import { createActiveMode, isInActiveMode } from "@ui/business";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { roundedWhiteCardStyle } from "@ui/styles/containerStyles";
import { Mode } from "@ui/type";
import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import styled from "styled-components/native";
import { Row } from "../layout";
import { ScoreView } from "../scoreView/ScoreView";
import { SecondaryText, TitleText } from "../text";

interface GlobalScoreCardProps {
	score?: number;
	style?: StyleProp<ViewStyle>;
	scoreQuality?: ScoreQuality;
	mode?: Mode;
}
export const GlobalScoreCard: React.FC<GlobalScoreCardProps> = ({
	score,
	scoreQuality,
	style,
	mode = createActiveMode(),
}) => {
	const { format, formatScoreQuality } = useI18n();

	return (
		<Container gap={16} align="center" justify="center" style={style}>
			<ScoreView value={score} color={colors.primary} mode={mode} />
			<View>
				<SecondaryText>{format("profile.global_score.label")}</SecondaryText>
				{isInActiveMode(mode) && scoreQuality && (
					<TitleText style={{ color: colors.primary }}>{formatScoreQuality(scoreQuality)}</TitleText>
				)}
			</View>
		</Container>
	);
};

const Container = styled(Row)`
	${roundedWhiteCardStyle};
	padding: 25px;
`;
