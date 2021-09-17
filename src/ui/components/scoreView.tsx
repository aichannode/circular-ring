import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleProp, ViewStyle } from "react-native";
import styled from "styled-components/native";
import { SineWave } from "./shapes/sineWave";
import { PrimaryText } from "./text";

interface ScoreViewProps {
	color: string;
	value: number;
	style?: StyleProp<ViewStyle>;
}

const scoreWaveAmplitude = 15;
const animationDuration = 2500;
// @refresh reset
export const ScoreView: React.FC<ScoreViewProps> = ({ color, value, style }) => {
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

	return (
		<Container color={color} style={style}>
			<Animated.View
				style={{
					position: "absolute",
					top: -scoreWaveAmplitude + (100 - value),
					left: 0,
					transform: [{ translateX: waveTranslateX }],
				}}
			>
				<SineWave color={color} amplitude={scoreWaveAmplitude} />
			</Animated.View>
			<ScoreValue>{value}</ScoreValue>
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
