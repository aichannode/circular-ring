import { getScoreQuality, ScoreQuality } from "@domain/measure/score";
import { Grow } from "@ui/components/layout";
import { SecondaryText } from "@ui/components/text";
import { colors, ScoreQualityColors } from "@ui/styles/colors";
import { roundedWhiteCardStyle } from "@ui/styles/containerStyles";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import styled from "styled-components/native";

interface DailyMetricProps {
	icon: number;
	label: string;
	value?: number;
	goodThreshold?: number;
	optimalThreshold?: number;
	style?: StyleProp<ViewStyle>;
}
export const DailyMetric: React.FC<DailyMetricProps> = ({
	icon,
	label,
	value,
	goodThreshold,
	optimalThreshold,
	style,
}) => {
	const scoreQuality =
		goodThreshold && optimalThreshold && value !== undefined ? getScoreQuality(value ?? 0) : undefined;

	return (
		<Container style={style}>
			<MetricIcon source={icon} />
			<SecondaryText>{label}</SecondaryText>
			<Grow />
			{!!scoreQuality && <QualityIndicator quality={scoreQuality} />}
			<Metric>{value !== undefined ? value : "-"}</Metric>
		</Container>
	);
};

const Container = styled.View`
	${roundedWhiteCardStyle};
	flex-direction: row;
	align-items: center;
	padding: 20px 25px;
`;

const MetricIcon = styled.Image`
	margin-right: 20px;
`;

const QualityIndicator = styled.View<{ quality: ScoreQuality }>`
	width: 10px;
	height: 10px;
	border-radius: 5px;
	background-color: ${({ quality }) => ScoreQualityColors[quality]};
	margin-right: 6px;
`;

const Metric = styled.Text`
	color: ${colors.textPrimary};
	font-size: 25px;
	font-weight: bold;
`;
