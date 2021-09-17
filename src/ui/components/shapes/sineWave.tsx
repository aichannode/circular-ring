import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

interface SineWaveProps {
	color: string;
	curvature?: number;
	amplitude?: number;
	alpha?: number;
	style?: StyleProp<ViewStyle>;
}
export const SineWave: React.FC<SineWaveProps> = ({ color, curvature = 0.4, amplitude = 15, alpha = 0.35, style }) => {
	const hexAlpha = Math.round(alpha * 255).toString(16);

	return (
		<Svg viewBox="0 0 200 200" style={[{ width: 200, height: 200 }, style]}>
			<Path
				d={
					"M 0,1" +
					curve(0, 1, 50, amplitude, curvature) +
					curve(50, amplitude, 100, 1, curvature) +
					curve(100, 1, 150, amplitude, curvature) +
					curve(150, amplitude, 200, 1, curvature) +
					"L 200,200 L 0,200 L 0,0"
				}
				strokeWidth={1}
				stroke={color}
				fill={color + hexAlpha}
			/>
		</Svg>
	);
};

const curve = (x1: number, y1: number, x2: number, y2: number, K: number) =>
	"C" + (x1 + K * (x2 - x1)) + "," + y1 + "," + (x2 - K * (x2 - x1)) + "," + y2 + "," + x2 + "," + y2;
