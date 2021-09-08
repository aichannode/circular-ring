import React from "react";
import { Circle, Defs, LinearGradient, Stop, Svg } from "react-native-svg";

export enum CircleGradient {
	PURPLE = "PURPLE",
	ORANGE = "ORANGE",
}
interface CircleProps {
	size: number;
	pathRatio?: number;
	strokeWidth?: number;
	gradient?: CircleGradient;
}
export const ChunkedCircle: React.FC<CircleProps> = ({
	size,
	pathRatio = 1,
	strokeWidth = 1,
	gradient = CircleGradient.ORANGE,
}) => {
	const svgSize = size + strokeWidth;
	const center = svgSize / 2;
	const circleRadius = size / 2;
	const perimeter = 2 * Math.PI * circleRadius;

	return (
		<Svg width={`${svgSize}`} height={`${svgSize}`}>
			<Defs>
				<LinearGradient id="ring-gradient" x1="0" y1="0" x2="1" y2="1">
					<Stop offset="0" stopColor={gradient === CircleGradient.ORANGE ? "#f44a59" : "#fd8081"} stopOpacity="1" />
					<Stop offset="1" stopColor={gradient === CircleGradient.ORANGE ? "#f97444" : "#ac7cd6"} stopOpacity="1" />
				</LinearGradient>
			</Defs>
			<Circle
				rotation={-90}
				origin={[center, center]}
				strokeDasharray={`${perimeter}`}
				strokeDashoffset={`${perimeter - pathRatio * perimeter}`}
				strokeWidth={`${strokeWidth}`}
				strokeLinecap="round"
				cx={`${center}`}
				cy={`${center}`}
				r={circleRadius}
				stroke="url(#ring-gradient)"
			/>
		</Svg>
	);
};
