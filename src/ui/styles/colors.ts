import { ScoreQuality } from "@domain/measure/representation/api";
import { SignalQuality } from "@domain/measure/score";
import { Intensity } from "@domain/ring/ringLiveData";

/**
 * Place here all the colors used in the application.
 * This object is for easily reference in other colors object
 * and should be used only in this file.
 */
const palette = {
	black: "#000000",
	primary: "#ff3d00",
	white: "#ffffff",
	white_2: "#dedede",
	gray: "#979797",
	darkGray: "#657884",
	extraLightGray: "#65788426",
	midGray: "#e3e3e3",
	lightgray: "#eeeeee",
	green: "#2bd866",
	orange: "#ff9334",
	red: "#e00a0a",
	redLight: "#ff3d00cc",
	orangeRed: "#ff1d1d",
	blue: "#3996f7",
	darkBlue: "#3960F7",
	sleepBlue: "#001871",
	redOrange: "#ff3d00",
	lightBlue: "#AEBBF0",
	high: "rgba(255,208,37, 0.89)",
	medium: "rgba(255,93,0, 0.75)",
	low: "rgba(255,29,29, 0.81)",
};

/**
 * Colors named by general used of business domain
 * usage.
 */
export const colors = {
	...palette,
	textPrimary: "#364249",
	textSecondary: "#333333",
	textTertiary: "#8A8A8E",
	textPlaceholder: "#657884",
	none: "rgb(222,222,222)",
	selected: "rgba(51,51,51, 0.89)",
	disabled: "#bfbfbf",

	gradient: {
		orange: ["#f44a59", "#f97444"],
		purple: ["#AC7CD6", "#FD8081"],
	},
	// Place here all the colors relative to business semantic.
	// TODO use some alias mechanisms to prevent update the same color in two places
	business: {
		actuvityPrimary: palette.red,
		activityDurationNone: "#ff000059",
		activityDurationShort: "#F06A6A",
		activityDurationSession: palette.red,
		activityStageNone: palette.white_2,
		activityStageLow: "#rgba(255, 29, 29, 0.89)",
		activityStageMedium: "rgba(255, 93, 0, 0.75)",
		activityStageHigh: "rgba(255, 208, 37, 0.81)",
		sleepPrimary: "#3960F7",
		alarmPrimary: "#3996f7",
		sleepAwake: "#19d946",
		sleepRem: "#00b3ff",
		sleepLight: "#117af3",
		sleepDeep: "#1831ae",
	},
} as const;

export const ScoreQualityColors: { [key in ScoreQuality]: string } = {
	[ScoreQuality.POOR]: colors.orangeRed,
	[ScoreQuality.GOOD]: colors.orange,
	[ScoreQuality.OPTIMAL]: colors.green,
};

export const SignalQualityColors: { [key in SignalQuality]: string } = {
	[SignalQuality.POOR]: colors.orangeRed,
	[SignalQuality.GOOD]: colors.green,
};

export const intensityColors: { [key in Intensity]: string } = {
	[Intensity.LOW]: colors.orangeRed,
	[Intensity.MEDIUM]: colors.orange,
	[Intensity.HIGH]: colors.green,
	[Intensity.NONE]: colors.textPrimary,
};
export const ActivityIntensityColors: { [key in Intensity]: string } = {
	[Intensity.LOW]: colors.low,
	[Intensity.MEDIUM]: colors.medium,
	[Intensity.HIGH]: colors.high,
	[Intensity.NONE]: colors.midGray,
};
