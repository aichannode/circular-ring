import { isDefined } from "@domain/common/business";
import { ScoreQuality } from "@domain/measure/representation/api";
import { createActiveMode, isInActiveMode, isInCalibrationMode, isInDisabledMode, updateMode } from "@ui/business";
import { Row } from "@ui/components/layout";
import { SecondaryText } from "@ui/components/text";
import { MetricColor } from "@ui/screens/type";
import { colors, ScoreQualityColors } from "@ui/styles/colors";
import { roundedWhiteCardStyle } from "@ui/styles/containerStyles";
import { Mode } from "@ui/type";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import styled from "styled-components/native";
import { lerp } from "../components/business";

interface ScoreGaugeProps {
	label: string;
	value?: string;
	percent?: number;
	quality: ScoreQuality;
	isInverted?: boolean;
	color?: MetricColor;
	calibration?: [number, number];
	style?: StyleProp<ViewStyle>;
	onPress?: () => void;
	mode?: Mode;
	forceDisplayValue?: boolean;
}

/**
 * @implements spec 00003 gauge is filled for a value from 50 to 100.
 */
export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
	value,
	percent,
	label,
	style,
	quality,
	isInverted,
	calibration = [-1, 1], // Default gauge calibration from spec 00003
	onPress,
	mode = createActiveMode(),
	forceDisplayValue = false,
}) => {
	const updatedMode = updateMode(mode, !isDefined(value) || !isDefined(percent) || isNaN(percent));
	const perc = isInActiveMode(updatedMode) ? lerp([0, 1], calibration)(percent as number) : undefined;

	return (
		<Container style={style} onPress={onPress}>
			<Row justify="space-between">
				<SecondaryText>{label}</SecondaryText>
				<SecondaryText>
					{isInDisabledMode(updatedMode) || (isInCalibrationMode(updatedMode) && !forceDisplayValue) ? "-" : value}
				</SecondaryText>
			</Row>
			<Gauge>
				<GaugeValue
					perc={isInActiveMode(updatedMode) ? Math.max(perc as number, 0.01) : 0} // always fill a bit the gauge
					isInverted={isInverted}
					style={{
						backgroundColor: ScoreQualityColors[quality],
					}}
				/>
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

const GaugeValue = styled.View<{ perc: number; isInverted?: boolean }>`
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	width: ${({ perc, isInverted }) => (isInverted ? 1 - perc : perc) * 100}%;
	border-radius: 5px;
`;
