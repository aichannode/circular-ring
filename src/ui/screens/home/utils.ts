import { FeedEntityStyle } from "@domain/feed/type"
import { colors } from "@ui/styles/colors"

export function getGradient(palette?: FeedEntityStyle): [string, string] | undefined {
	switch(palette) {
		case FeedEntityStyle.WHITE_WITH_PURPLE_GRADIENT:
			return [colors.purpleGarientStart, colors.purpleGarientEnd]
		case FeedEntityStyle.WHITE_WITH_DARK_BLUE_BORDER:
			return [colors.darkBlue, colors.darkBlue]
		case FeedEntityStyle.WHITE_WITH_LIGHT_BLUE_BORDER:
			return [colors.lightBlue, colors.lightBlue]
		case FeedEntityStyle.WHITE_WITH_ORANGE_BORDER:
			return [colors.orange, colors.orange]
		case FeedEntityStyle.WHITE_WITH_RED_BORDER:
			return [colors.orangeRed, colors.orangeRed]
		case FeedEntityStyle.ORANGE_GRADIENT:
		default:
			return undefined
	}
}