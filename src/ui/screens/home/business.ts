import { FeedEntityStyle } from "@domain/feed/type";
import { colors } from "@ui/styles/colors";

export function getGradient(palette?: FeedEntityStyle) {
	switch (palette) {
		case FeedEntityStyle.WHITE_WITH_PURPLE_GRADIENT_BORDER:
			return colors.gradient.purple;
		case FeedEntityStyle.WHITE_WITH_BLUE_BORDER:
			return [colors.blue, colors.blue];
		case FeedEntityStyle.WHITE_WITH_DARK_BLUE_BORDER:
			return [colors.darkBlue, colors.darkBlue];
		case FeedEntityStyle.WHITE_WITH_LIGHT_BLUE_BORDER:
			return [colors.lightBlue, colors.lightBlue];
		case FeedEntityStyle.WHITE_WITH_ORANGE_BORDER:
			return [colors.orange, colors.orange];
		case FeedEntityStyle.WHITE_WITH_RED_BORDER:
			return [colors.red, colors.red];
		case FeedEntityStyle.ORANGE_GRADIENT:
			return colors.gradient.orange;
		default:
			return undefined;
	}
}
