import React, { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
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
		<Animated.View
			style={{ transform: [{ rotate: t.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] }) }] }}
		>
			<ChunkedCircle size={size} pathRatio={0.6} strokeWidth={3} />
		</Animated.View>
	);
};
