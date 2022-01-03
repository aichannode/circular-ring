import { Row } from "@ui/components/layout";
import { SecondaryText } from "@ui/components/text";
import { GaugeColor } from "@ui/screens/type";
import { colors } from "@ui/styles/colors";
import { roundedWhiteCardStyle } from "@ui/styles/containerStyles";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import styled from "styled-components/native";

interface ScoreGaugeProps {
	label: string;
	value: string,
	gaugeFilling: number,
	isInverted?: boolean,
	color: GaugeColor,
	style?: StyleProp<ViewStyle>;
	onPress?: () => void;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
	label,
	value,
	style,
	color,
	isInverted,
	gaugeFilling,
	onPress,
}) => {
	return (
		<Container style={style} onPress={onPress}>
			<Row justify="space-between">
				<SecondaryText>{label}</SecondaryText>
				<SecondaryText>{value}</SecondaryText>
			</Row>
			<Gauge>
				<GaugeValue
					perc={gaugeFilling}
					isInverted={isInverted}
					style={{backgroundColor: color === GaugeColor.RED
						? colors.red
						: color === GaugeColor.ORANGE
							? colors.orange
							: colors.green
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

const GaugeValue = styled.View<{ perc: number, isInverted?: boolean }>`
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	width: ${({ perc, isInverted }) => (isInverted ? 1 - perc : perc) * 100}%;
	border-radius: 5px;
`;
