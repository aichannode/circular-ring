import { useRingBattery } from "@domain/ring/hooks";
import { RingBatteryStatus } from "@domain/ring/ringBattery";
import { useI18n } from "@ui/i18n";
import React from "react";
import { Image, StyleProp, ViewStyle } from "react-native";
import styled from "styled-components/native";
import { ChunkedCircle, CircleGradient } from "../shapes/chunkedCircle";
import { SecondaryText } from "../text";

interface RingBatteryViewProps {
	style?: StyleProp<ViewStyle>;
	size: number;
	detailed?: boolean;
}
export const RingBatteryView: React.FC<RingBatteryViewProps> = ({ style, size, detailed }) => {
	const strokeWidth = Math.round(size / (detailed ? 12 : 9));
	const fontSize = Math.round(size / (detailed ? 4 : 2.5));
	const { format } = useI18n();

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
				{ringBattery?.status === RingBatteryStatus.CHARGING && !detailed ? (
					<Image source={require("@assets/images/charging.png")} width={fontSize} height={fontSize} />
				) : (
					<BatteryValue style={{ fontSize }}>
						{ringBattery?.charge ?? "?"}
						{detailed && "%"}
					</BatteryValue>
				)}

				{detailed && <SecondaryText>{format("ring.battery.label")}</SecondaryText>}
			</CenterView>
		</Container>
	);
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
