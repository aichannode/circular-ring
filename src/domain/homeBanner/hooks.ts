import { useServices } from "@core/services";
import { useObservable } from "micro-observables";
import { useEffect } from "react";

export function useHomeBanner() {
	const { homeBannerService, calibrationService } = useServices();
	const currentBanner = useObservable(homeBannerService.visibleBanner);

	useEffect(() => {
		calibrationService.fetchCalibrationLeft();
	}, []);

	return currentBanner;
}
