import { useRingBattery } from "@domain/ring/hooks";
import React from "react";
import { StyleProp, Text, ViewStyle } from "react-native";
import { Circle, Defs, LinearGradient, Stop, Svg } from "react-native-svg";
import styled from "styled-components/native";

// const circleSize = 28;
// const circleRadius = circleSize / 2;
// const perimeter = 2 * Math.PI * circleRadius;
// const strokeWidth = 3;
// const svgSize = circleSize + 4;
// const center = svgSize / 2;
const strokeWidth = 3;

interface RingBatteryViewProps {
	style?: StyleProp<ViewStyle>;
	size: number;
}
export const RingBatteryView: React.FC<RingBatteryViewProps> = ({ style, size }) => {
	const svgSize = size + strokeWidth;
	const center = svgSize / 2;
	const circleRadius = size / 2;
	const perimeter = 2 * Math.PI * circleRadius;

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
					cx={`${center}`}
					cy={`${center}`}
					r={circleRadius}
					stroke="url(#ring-gradient)"
				/>
			</Svg>
			<CenterView>
				<BatteryValue>{ringBattery?.charge ?? "?"}</BatteryValue>
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
`;
