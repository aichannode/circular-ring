import { Row } from "@ui/components/layout";
import { SecondaryText } from "@ui/components/text";
import { MetricColor } from "@ui/screens/type";
import { colors } from "@ui/styles/colors";
import { roundedWhiteCardStyle } from "@ui/styles/containerStyles";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import styled from "styled-components/native";
import { lerp } from "../business";

interface ScoreGaugeProps {
	label: string;
	value: string;
	gaugeFilling: number;
	isInverted?: boolean;
	color: MetricColor;
	calibration?: [number, number];
	style?: StyleProp<ViewStyle>;
	onPress?: () => void;
}

/**
 * @implements spec 00003 gauge is filled for a value from 50 to 100.
 */
export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
	label,
	value,
	style,
	color,
	isInverted,
	gaugeFilling,
	calibration = [0.5, 1], // Default gauge calibration from spec 00003
	onPress,
}) => {
	const perc = lerp([0, 1], calibration)(gaugeFilling);

	return (
		<Container style={style} onPress={onPress}>
			<Row justify="space-between">
				<SecondaryText>{label}</SecondaryText>
				<SecondaryText>{value}</SecondaryText>
			</Row>
			<Gauge>
				<GaugeValue
					perc={perc}
					isInverted={isInverted}
					style={{
						backgroundColor:
							color === MetricColor.RED
								? colors.orangeRed
								: color === MetricColor.ORANGE
								? colors.orange
								: colors.green,
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
