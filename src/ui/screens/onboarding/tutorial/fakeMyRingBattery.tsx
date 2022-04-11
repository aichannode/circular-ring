import { useRingBattery } from "@domain/device/hooks";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import styled from "styled-components/native";
import { ChunkedCircle, CircleGradient } from "@ui/components/shapes/chunkedCircle";

interface RingBatteryViewProps {
	style?: StyleProp<ViewStyle>;
	size: number;
	detailed?: boolean;
}
export const RingBatteryView: React.FC<RingBatteryViewProps> = ({ style, size, detailed }) => {
	const strokeWidth = Math.round(size / (detailed ? 12 : 9));
	const fontSize = Math.round(size / (detailed ? 4 : 2.5));

	const ringBattery = useRingBattery();

	return (
		<Container style={style}>
			<ChunkedCircle
				size={size}
				strokeWidth={strokeWidth}
				gradient={CircleGradient.PURPLE}
				pathRatio={(ringBattery?.charge ?? 75) / 100}
			/>
			<CenterView>
				<BatteryValue style={{ fontSize }}>75</BatteryValue>
			</CenterView>
		</Container>
	);
};

const Container = styled.View`
	margin-left: -20px;
`;

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
