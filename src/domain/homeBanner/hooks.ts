import { useServices } from "@core/services";
import { useObservable } from "micro-observables";
import { useEffect } from "react";

export function useHomeBanner() {
	const { homeBannerService } = useServices();
	const currentBanner = useObservable(homeBannerService.visibleBanner);

	useEffect(() => {
		homeBannerService.fetchBanners();
	}, []);

	return currentBanner;
}
