import { Activity, FeedEntityStyle } from "@domain/feed/type";
import { colors } from "@ui/styles/colors";
import { ColorValue } from "react-native";

export function getColorFromBannerStyle(style: Activity["style"]): ColorValue | undefined {
	switch (style) {
		case FeedEntityStyle.WHITE_WITH_DARK_BLUE_BORDER:
			return colors.darkBlue;
	}
}
