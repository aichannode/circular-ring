import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleProp, Text, ViewStyle } from "react-native";
import styled from "styled-components/native";
import { SineWave } from "./shapes/sineWave";
import { PrimaryText } from "./text";

interface ScoreViewProps {
	color: string;
	textColor?: string;
	value?: number;
	style?: StyleProp<ViewStyle>;
}

const scoreWaveAmplitude = 15;
const animationDuration = 2500;
const noValueHeight = 60;
// @refresh reset
export const ScoreView: React.FC<ScoreViewProps> = ({ color, textColor, value = 0, style }) => {
	const waveTranslateX = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		const animation = Animated.timing(waveTranslateX, {
			toValue: -100,
			useNativeDriver: true,
			easing: Easing.linear,
			duration: animationDuration,
		});
		Animated.loop(animation).start();
	}, []);

	const units = Math.floor(value);
	const decimals = ((value - units) * 100).toFixed(0);

	return (
		<Container color={color} style={style}>
			<Animated.View
				style={{
					position: "absolute",
					top: -scoreWaveAmplitude + (100 - (value || noValueHeight)),
					left: 0,
					transform: [{ translateX: waveTranslateX }],
				}}
			>
				<SineWave color={color} amplitude={scoreWaveAmplitude} />
			</Animated.View>
			<ScoreValue style={{ color: textColor ?? color }}>
				{Math.floor(value) || "-"}
				{+decimals > 0 && <Text style={{ fontSize: 12 }}>,{decimals}</Text>}
			</ScoreValue>
		</Container>
	);
};

const Container = styled.View<{ color: string }>`
	border: 2px solid ${({ color }) => color};
	width: 100px;
	height: 100px;
	border-radius: 50px;
	overflow: hidden;
	justify-content: center;
	align-items: center;
`;

const ScoreValue = styled(PrimaryText)`
	font-weight: bold;
	font-size: 30px;
`;
