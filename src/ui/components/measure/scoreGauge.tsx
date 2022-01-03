import { getScoreQuality, ScoreQuality, ScoreUnit } from "@domain/measure/score";
import { Row } from "@ui/components/layout";
import { SecondaryText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { colors, ScoreQualityColors } from "@ui/styles/colors";
import { roundedWhiteCardStyle } from "@ui/styles/containerStyles";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import styled from "styled-components/native";

interface ScoreGaugeProps {
	label: string;
	value?: number;
	rate?: number;
	unit: ScoreUnit;
	goodThreshold?: number;
	optimalThreshold?: number;
	style?: StyleProp<ViewStyle>;
	onPress?: () => void;
	displayGaugeValue?: boolean;
	gaugeInverted?: boolean;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
	label,
	value,
	rate,
	unit,
	goodThreshold = 0.8,
	optimalThreshold = 0.9,
	style,
	onPress,
	displayGaugeValue,
	gaugeInverted,
}) => {
	const gaugeRatio = gaugeInverted && rate !== undefined ? 1 - rate : rate;
	const scoreQuality = gaugeRatio !== undefined ? getScoreQuality(gaugeRatio) : undefined;

	const { formatScoreQuality, formatTranquility, formatDuration } = useI18n();

	return (
		<Container style={style} onPress={onPress}>
			<Row justify="space-between">
				<SecondaryText>{label}</SecondaryText>
				<SecondaryText>
					{value === undefined || scoreQuality === undefined
						? "-"
						: unit === "qualitative"
						? formatScoreQuality(scoreQuality)
						: unit === "tranquility"
						? formatTranquility(scoreQuality)
						: unit === "time"
						? formatDuration(value * 60)
						: `${value}${unit}`}
					{displayGaugeValue && rate !== undefined ? ` (${Math.round(rate * 100)}%)` : ""}
				</SecondaryText>
			</Row>
			<Gauge>
				<GaugeValue quality={scoreQuality} rate={gaugeRatio ?? 0} />
			</Gauge>
		</Container>
	);
};

const Container = styled.Pressable`
	${roundedWhiteCardStyle};
	padding: 20px 25px;
`;

const Gauge = styled.View`
	margin-top: 10px;
	background-color: ${colors.lightgray};
	border-radius: 5px;
	height: 5px;
	overflow: hidden;
`;

const GaugeValue = styled.View<{ quality?: ScoreQuality; rate: number }>`
	background-color: ${({ quality }) => (quality ? ScoreQualityColors[quality] : colors.lightgray)};
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	width: ${({ rate }) => rate * 100}%;
	border-radius: 5px;
`;
