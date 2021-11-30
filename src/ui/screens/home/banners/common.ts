import { BannerAction, HomeBanner } from "@domain/homeBanner/homeBanner";
import { Navigate, Routes } from "@ui/navigation/routes";
import { openURL } from "@ui/utils/urlUtils";

export function getActionHandler(banner: HomeBanner, navigate: Navigate) {
	return () => {
		const action = banner.actions[0];
		if (action) {
			switch (action.type) {
				case BannerAction.OPEN_WEB:
					openURL(action.data);
					break;
				case BannerAction.APP_PAGE:
					navigate(Routes.Activity); // TODO Handle routing with backend when we got specs
					break;
				default:
					throw Error("Unhandled client action");
			}
		}
	};
}
