import { useServices } from "@core/services";
import { useObservable } from "micro-observables";
import moment from "moment";
import { useEffect } from "react";
import { isToday, isYesterday } from "./business";
import { HomeBanner } from "./homeBanner";

export function useBanners() {
	const { homeBannerService } = useServices();
	const banners = useObservable(homeBannerService.banners)
	
	useEffect(() => {
		homeBannerService.fetchBanners();
	}, []);

	// Group banners by date
	const groups = new Map<string, HomeBanner[]>()

	for (const banner of banners) {
		const today = new Date().toISOString()
		// Upsert in today group
		if (isToday(banner.startDate, today)) {
			groups.get("today")?.push(banner) ?? groups.set("today", [banner])
			continue;
		}

		// Upsert in yesterday group
		if (isYesterday(banner.startDate, today)) {
			groups.get("yesterday")?.push(banner) ?? groups.set("yesterday", [banner])
			continue;
		}

		// Upsert in exact date
		const newDate = moment(banner.startDate).format("YYYY-MM-DD")
		groups.get(newDate)?.push(banner) ?? groups.set(newDate, [banner])
	}

	return groups;
}