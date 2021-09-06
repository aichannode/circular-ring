import { useRingBattery } from "@domain/ring/hooks";
import { useI18n } from "@ui/i18n";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Circle, Defs, LinearGradient, Stop, Svg } from "react-native-svg";
import styled from "styled-components/native";
import { SecondaryText } from "../text";

interface RingBatteryViewProps {
	style?: StyleProp<ViewStyle>;
	size: number;
	detailed?: boolean;
}
export const RingBatteryView: React.FC<RingBatteryViewProps> = ({ style, size, detailed }) => {
	const strokeWidth = Math.round(size / 9);
	const svgSize = size + strokeWidth;
	const center = svgSize / 2;
	const circleRadius = size / 2;
	const perimeter = 2 * Math.PI * circleRadius;
	const fontSize = Math.round(size / (detailed ? 4 : 2.5));
	const { format } = useI18n();

	const ringBattery = useRingBattery();

	return ringBattery ? (
		<Container style={style}>
			<Svg width={`${svgSize}`} height={`${svgSize}`}>
				<Defs>
					<LinearGradient id="ring-gradient" x1="0" y1="0" x2="1" y2="1">
						<Stop offset="0" stopColor="#fd8081" stopOpacity="1" />
						<Stop offset="1" stopColor="#ac7cd6" stopOpacity="1" />
					</LinearGradient>
				</Defs>
				<Circle
					rotation={-90}
					origin={[center, center]}
					strokeDasharray={`${perimeter}`}
					strokeDashoffset={`${perimeter - (ringBattery.charge / 100) * perimeter}`}
					strokeWidth={`${strokeWidth}`}
					strokeLinecap="round"
					cx={`${center}`}
					cy={`${center}`}
					r={circleRadius}
					stroke="url(#ring-gradient)"
				/>
			</Svg>
			<CenterView>
				<BatteryValue style={{ fontSize }}>
					{ringBattery?.charge ?? "?"}
					{detailed && "%"}
				</BatteryValue>
				{detailed && <SecondaryText>{format("ring.battery.label")}</SecondaryText>}
			</CenterView>
		</Container>
	) : null;
};

const Container = styled.View``;

const BatteryValue = styled.Text`
	font-weight: bold;
`;

const CenterView = styled.View`
	position: absolute;
	top: 0;
	right: 0;
	left: 0;
	bottom: 0;
	align-items: center;
	justify-content: center;
	flex-direction: column;
`;
