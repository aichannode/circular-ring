import { ScoreQuality } from "@domain/circleActivity/circleActivityData";

export const colors = {
	primary: "#ff3d00",
	white: "#ffffff",
	lightGray: "#ebebeb",
	gray: "#979797",
	charcoalGrey: "#344249",
	lightgray: "#eeeeee",
	textPrimary: "#364249",
	textSecondary: "#333333",
	textPlaceholder: "#657884",
	green: "#2bd866",
	orange: "#ff9334",
	red: "#ff1d1d",
};

export const qualityColors: { [key in ScoreQuality]: string } = {
	[ScoreQuality.POOR]: colors.red,
	[ScoreQuality.GOOD]: colors.orange,
	[ScoreQuality.OPTIMAL]: colors.green,
};
