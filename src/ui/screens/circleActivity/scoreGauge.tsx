import { getScoreQuality, ScoreQuality, ScoreUnit } from "@domain/circleActivity/circleActivityData";
import { SecondaryText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { colors, qualityColors } from "@ui/styles/colors";
import { whiteCardStyle } from "@ui/styles/containerStyles";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import styled from "styled-components/native";

interface ScoreGaugeProps {
	label: string;
	value: number;
	rate: number;
	unit: ScoreUnit;
	goodThreshold?: number;
	optimalThreshold?: number;
	style?: StyleProp<ViewStyle>;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
	label,
	value,
	rate,
	unit,
	goodThreshold = 0.8,
	optimalThreshold = 0.9,
	style,
}) => {
	const scoreQuality = getScoreQuality(rate, goodThreshold, optimalThreshold);

	const { formatScoreQuality } = useI18n();

	return (
		<Container style={style}>
			<Topside>
				<SecondaryText>{label}</SecondaryText>
				<SecondaryText>{unit === "qualitative" ? formatScoreQuality(scoreQuality) : `${value}${unit}`}</SecondaryText>
			</Topside>
			<Gauge>
				<GaugeValue quality={scoreQuality} rate={rate} />
			</Gauge>
		</Container>
	);
};

const Container = styled.View`
	${whiteCardStyle};
	border-radius: 5px;
	padding: 20px 25px;
`;

// TODO Replace with Row when merged
const Topside = styled.View`
	flex-direction: row;
	justify-content: space-between;
`;

const Gauge = styled.View`
	margin-top: 10px;
	background-color: ${colors.lightgray};
	border-radius: 5px;
	height: 5px;
	overflow: hidden;
`;

const GaugeValue = styled.View<{ quality: ScoreQuality; rate: number }>`
	background-color: ${({ quality }) => qualityColors[quality]};
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	width: ${({ rate }) => rate * 100}%;
	border-radius: 5px;
`;
