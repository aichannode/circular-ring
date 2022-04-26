import { createActiveMode, isInActiveMode, isInCalibrationMode, isInDisabledMode } from "@ui/business";
import { useI18n } from "@ui/i18n";
import { Mode } from "@ui/type";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleProp, Text, ViewStyle } from "react-native";
import styled from "styled-components/native";
import { lerp } from "../business";
import { SineWave } from "../shapes/sineWave";
import { PrimaryText } from "../text";

interface ScoreViewProps {
	color: string;
	textColor?: string;
	value?: number;
	style?: StyleProp<ViewStyle>;
	mode?: Mode;
}

const scoreWaveAmplitude = 15;
const animationDuration = 2500;
const noValueHeight = 60;
/**
 * @implements spec [00003](https://docs.google.com/document/d/16SRBS_XPqDhePKuCi6rQm399n72H_82GTPAiay6AQlQ/edit?disco=AAAAWbZAWfY) Flask is filled for a value from 50 to 100.
 */
export const ScoreView: React.FC<ScoreViewProps> = ({
	color,
	textColor,
	value = 0,
	style,
	mode = createActiveMode(),
}) => {
	const { format } = useI18n();

	if (isInCalibrationMode(mode)) {
		// XXX: from https://app.zeplin.io/project/612f3d589c650611e6322ac2/screen/61c5d1831699c56b2f3f3c1b
		value = 0.9;
	} else if (isInDisabledMode(mode)) {
		value = 0;
	}

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

	const integer = Math.floor(value * 100);
	const decimals = (value * 100 - integer).toFixed(0);
	const waveValue = lerp([0, 1], [-1, 1])(value); // Empty flask is 50, full flask is 100
	const wavePosition = -scoreWaveAmplitude / 2 + (100 - (waveValue * 100 || noValueHeight));

	return (
		<Container color={color} style={style}>
			<Animated.View
				style={{
					position: "absolute",
					top: wavePosition,
					left: 0,
					transform: [{ translateX: waveTranslateX }],
				}}
			>
				<SineWave color={color} amplitude={scoreWaveAmplitude} />
			</Animated.View>
			<ScoreValue style={{ color: textColor ?? color }}>
				{isInActiveMode(mode) ? (
					integer
				) : isInCalibrationMode(mode) ? (
					<Text style={{ fontSize: 16 }}>{format("global.no_data")}</Text>
				) : (
					"-"
				)}
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
