import { Row } from "@ui/components/layout";
import { OrangeDiagonalGradient } from "@ui/components/shapes/gradients";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { shadow } from "@ui/styles/containerStyles";
import React, { useEffect, useMemo, useRef } from "react";
import { Animated, StyleProp, ViewStyle } from "react-native";
import styled from "styled-components/native";

interface HeartBeatCardProps {
	listening: boolean;
	heartRate?: number;
	onToggle: () => void;
	style?: StyleProp<ViewStyle>;
}

const FAKE_HEART_RATE = 70;
// @refresh reset
export const HeartBeatCard: React.FC<HeartBeatCardProps> = ({ listening, heartRate, onToggle, style }) => {
	const { format } = useI18n();
	const beat = useRef(new Animated.Value(1)).current;

	const animationTime = (60 / FAKE_HEART_RATE) * 1000;

	const animation = useMemo(
		() =>
			Animated.loop(
				Animated.sequence([
					Animated.timing(beat, { toValue: 1.2, useNativeDriver: true, duration: animationTime / 8 }),
					Animated.timing(beat, { toValue: 0.9, useNativeDriver: true, duration: animationTime / 8 }),
					Animated.timing(beat, { toValue: 1.1, useNativeDriver: true, duration: animationTime / 8 }),
					Animated.timing(beat, { toValue: 1, useNativeDriver: true, duration: animationTime / 8 }),
					Animated.delay(animationTime / 2),
				])
			),
		[animationTime]
	);

	useEffect(() => {
		if (listening) {
			animation.start();
		} else {
			animation.reset();
		}
	}, [listening]);

	return (
		<Container style={style}>
			<HeartRateCard>
				<Animated.Image style={{ transform: [{ scale: beat }] }} source={require("@assets/images/heartBeat.png")} />
				{heartRate !== undefined && (
					<HeartRateValue>
						{heartRate}
						<HeartRateUnit>bpm</HeartRateUnit>
					</HeartRateValue>
				)}
			</HeartRateCard>
			<PlayPauseButton onPress={onToggle}>
				<PlayPauseButtonContent>
					{listening ? (
						<Row gap={8}>
							<PauseBar />
							<PauseBar />
						</Row>
					) : (
						<StartLabel>{format("live.start")}</StartLabel>
					)}
				</PlayPauseButtonContent>
			</PlayPauseButton>
		</Container>
	);
};

const Container = styled.View`
	${shadow("2px 4px")}
	padding-bottom: 42px;
`;

const HeartRateCard = styled(OrangeDiagonalGradient)`
	border-radius: 22px;
	height: 200px;
	padding: 11px;
	align-items: center;
`;

const PlayPauseButton = styled.Pressable`
	position: absolute;
	bottom: 0;
	align-self: center;

	${shadow("4px 5px", 18)}
`;

const PlayPauseButtonContent = styled(OrangeDiagonalGradient)`
	width: 84px;
	height: 84px;
	border-radius: 42px;
	align-items: center;
	justify-content: center;
`;

const PauseBar = styled.View`
	background-color: ${colors.white};
	border-radius: 10px;
	width: 7px;
	height: 30px;
`;

const StartLabel = styled.Text`
	font-size: 19px;
	color: ${colors.white};
	font-weight: bold;
`;

const HeartRateValue = styled.Text`
	margin-top: 14px;
	font-size: 40px;
	text-align: center;
	font-weight: 500;
	color: ${colors.white};
`;

const HeartRateUnit = styled.Text`
	font-size: 19px;
`;
