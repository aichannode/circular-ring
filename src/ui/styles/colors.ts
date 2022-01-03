import { SignalQuality, ScoreQuality } from "@domain/measure/score";
import { Intensity } from "@domain/ring/ringLiveData";

export const colors = {
	black: "#000000",
	primary: "#ff3d00",
	white: "#ffffff",
	gray: "#979797",
	darkGray: "#657884",
	midGray: "#e3e3e3",
	lightgray: "#eeeeee",
	textPrimary: "#364249",
	textSecondary: "#333333",
	textTertiary: "#8A8A8E",
	textPlaceholder: "#657884",
	green: "#2bd866",
	orange: "#ff9334",
	red: "#ff1d1d",
	blue: "#3996f7",
	darkBlue: "#3960F7",
	sleepBlue: "#001871",
	orangeRed: "#ff3d00",
	lightBlue: "#AEBBF0",
	orangeGradientStart: "#f44a59",
	orangeGradientEnd: "#f97444",
	purpleGarientStart: "#AD7CD4",
	purpleGarientEnd: "#FC7F81",
	high: "rgba(255,208,37, 0.89)",
	medium: "rgba(255,93,0, 0.75)",
	low: "rgba(255,29,29, 0.81)",
	none: "rgb(222,222,222)",
	selected: "rgba(51,51,51, 0.89)",
	disabled: "#bfbfbf",
	// Place here all the colors relative to business semantic
	business: {
		activityPrimary: "#e00a0a",
		activityNone: "#ff000059",
		activityLow: "#F06A6A",
		activityHigh: "#DD2A2A",
		sleepPrimary: "#2932ee",
	},
};

export const ScoreQualityColors: { [key in ScoreQuality]: string } = {
	[ScoreQuality.POOR]: colors.red,
	[ScoreQuality.GOOD]: colors.orange,
	[ScoreQuality.OPTIMAL]: colors.green,
};

export const SignalQualityColors: { [key in SignalQuality]: string } = {
	[SignalQuality.POOR]: colors.red,
	[SignalQuality.GOOD]: colors.green,
};

export const intensityColors: { [key in Intensity]: string } = {
	[Intensity.LOW]: colors.red,
	[Intensity.MEDIUM]: colors.orange,
	[Intensity.HIGH]: colors.green,
	[Intensity.NONE]: colors.textPrimary,
};

export const ActivityIntensityColors: { [key in Intensity]: string } = {
	[Intensity.LOW]: colors.low,
	[Intensity.MEDIUM]: colors.medium,
	[Intensity.HIGH]: colors.high,
	[Intensity.NONE]: colors.none,
};
