import { useServices } from "@core/services";
import { useObservable } from "micro-observables";
import moment, { Moment } from "moment";
import { useEffect } from "react";
import { HomeBanner } from "./homeBanner";

function didHappenToday(date: Moment, today: Moment) {
	return date.isSame(today, 'd')
}

function didHappenYesterday(date: Moment, today: Moment) {
	const yesterday = today.subtract(1, 'days')
	return date.isSame(yesterday, 'd')
}

export function useBanners() {
	const { homeBannerService } = useServices();
	const banners = useObservable(homeBannerService.banners)
	
	useEffect(() => {
		homeBannerService.fetchBanners();
	}, []);

	// Group banners by date
	const groups = new Map<string, HomeBanner[]>()

	for (const banner of banners) {
		const currentDay = moment().startOf('day')
		const bannerDate = moment(banner.startDate)
		// Upsert in today group
		if (didHappenToday(bannerDate, currentDay)) {
			groups.get("today")?.push(banner) ?? groups.set("today", [banner])
			continue;
		}

		// Upsert in yesterday group
		if (didHappenYesterday(bannerDate, currentDay)) {
			groups.get("yesterday")?.push(banner) ?? groups.set("yesterday", [banner])
			continue;
		}

		// Upsert in exact date
		const newDate = bannerDate.format("YYYY-MM-DD")
		groups.get(newDate)?.push(banner) ?? groups.set(newDate, [banner])
	}

	return groups;
}