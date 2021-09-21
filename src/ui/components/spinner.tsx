import React, { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import styled from "styled-components/native";
import { ChunkedCircle } from "./shapes/chunkedCircle";

interface SpinnerProps {
	size?: number;
}

// @refresh reset
export const Spinner: React.FC<SpinnerProps> = ({ size = 52 }) => {
	const t = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		Animated.loop(
			Animated.timing(t, { toValue: 1, useNativeDriver: true, easing: Easing.linear, duration: 750 })
		).start();
	}, []);
	return (
		<Container>
			<Animated.View
				style={{
					transform: [{ rotate: t.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] }) }],
				}}
			>
				<ChunkedCircle size={size} pathRatio={0.6} strokeWidth={size > 20 ? 3 : 2} />
			</Animated.View>
		</Container>
	);
};

const Container = styled.View`
	align-items: center;
	justify-content: center;
`;
