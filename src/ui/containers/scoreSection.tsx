import { isDefined } from "@domain/common/business";
import { ScoreQuality } from "@domain/measure/representation/api";
import { createActiveMode, isInActiveMode, isInCalibrationMode, updateMode } from "@ui/business";
import { ResponsiveCenterView, Stack } from "@ui/components/layout";
import { ScoreView } from "@ui/components/scoreView/ScoreView";
import { SecondaryText, TitleText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { colors, ScoreQualityColors } from "@ui/styles/colors";
import { roundedWhiteCardStyle } from "@ui/styles/containerStyles";
import { Mode } from "@ui/type";
import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import styled from "styled-components/native";

interface ScoreSectionProps {
	label: string;
	quality?: ScoreQuality;
	score?: number;
	color: string;
	style?: StyleProp<ViewStyle>;
	setState?: React.Dispatch<React.SetStateAction<boolean>>;
	state?: boolean;
	mode?: Mode;
}
export const ScoreSection: React.FC<ScoreSectionProps> = ({
	score,
	color,
	label,
	style,
	quality,
	setState,
	mode = createActiveMode(),
}) => {
	const updatedMode = updateMode(mode, !isDefined(score) || isNaN(score) || !isDefined(quality));

	const { format, formatScoreQuality } = useI18n();

	return (
		<ResponsiveCenterView style={style} maxWidth={175} align="stretch" horizontalPadding={0}>
			<SecondaryText>{label}</SecondaryText>
			<Touchable activeOpacity={setState ? 0.2 : 1} onPress={() => (setState ? setState((state) => !state) : null)}>
				<ScoreWrapper align="center" gap={12}>
					<ScoreView value={score} color={color} textColor={colors.textPrimary} mode={updatedMode} />
					<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
						{isInActiveMode(updatedMode) ? (
							<>
								<ColoredDot color={ScoreQualityColors[quality as ScoreQuality]} />
								<TitleText>{formatScoreQuality(quality as ScoreQuality)}</TitleText>
							</>
						) : isInCalibrationMode(updatedMode) ? (
							<TitleText style={{ color }}>
								{format("calibration.placeholder", { days: updatedMode.nbRemainingDays })}
							</TitleText>
						) : (
							<TitleText style={{ color }}> {format("global.not_enough_data")}</TitleText>
						)}
					</View>
				</ScoreWrapper>
			</Touchable>
		</ResponsiveCenterView>
	);
};

const Touchable = styled.TouchableOpacity`
	${roundedWhiteCardStyle};
	margin-top: 15px;
	padding-vertical: 30px;
`;

const ScoreWrapper = styled(Stack)`
	/* ${roundedWhiteCardStyle};
	margin-top: 15px;
	padding-vertical: 30px; */
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
