import { ScoreQuality } from "@domain/circleActivity/circleActivityData";
import { Intensity } from "@domain/ring/ringLiveData";

export const colors = {
	primary: "#ff3d00",
	white: "#ffffff",
	gray: "#979797",
	darkGray: "#657884",
	lightgray: "#eeeeee",
	textPrimary: "#364249",
	textSecondary: "#333333",
	textTertiary: "#8A8A8E",
	textPlaceholder: "#657884",
	green: "#2bd866",
	orange: "#ff9334",
	red: "#ff1d1d",
	blue: "#3996f7",
	orangeGradientStart: "#f44a59",
	orangeGradientEnd: "#f97444",
	disabled: "#bfbfbf",
};

export const qualityColors: { [key in ScoreQuality]: string } = {
	[ScoreQuality.POOR]: colors.red,
	[ScoreQuality.GOOD]: colors.orange,
	[ScoreQuality.OPTIMAL]: colors.green,
};

export const intensityColors: { [key in Intensity]: string } = {
	[Intensity.LOW]: colors.red,
	[Intensity.MEDIUM]: colors.orange,
	[Intensity.HIGH]: colors.green,
	[Intensity.NONE]: colors.textPrimary,
};
