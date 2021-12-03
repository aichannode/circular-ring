import { useServices } from "@core/services";
import { useObservable } from "micro-observables";
import moment from "moment";
import { useEffect } from "react";
import { isToday, isYesterday } from "./business";
import { FeedRecommendation, FeedBanner, FeedEntityType, FeedEntity } from "./type";

export type SortedFeedEntities = {
	notifications: FeedBanner[]
	activities: Record<string, FeedRecommendation[]>
}
const isNotification = (banner: FeedEntity): banner is FeedBanner => banner.type === FeedEntityType.BANNER
const isActivity = (banner: FeedEntity): banner is FeedRecommendation => banner.type !== FeedEntityType.BANNER

export function useFeed(): SortedFeedEntities {
	const { homeBannerService } = useServices();
	const banners = useObservable(homeBannerService.banners)
	
	useEffect(() => {
		homeBannerService.fetchBanners();
	}, []);

	// Split BANNER from other banners type and groups activities by date.
	return {
		notifications: banners.filter(isNotification),
		activities: banners
			.filter(isActivity)
			.reduce<Record<string, FeedRecommendation[]>>(function(groups, banner) {
				const today = new Date().toISOString()
				// Upsert in today group
				if (isToday(banner.startDate, today)) {
					if (groups["today"]) {
						groups["today"].push(banner)
					} else {
						groups["today"] = [banner]
					}
				}

				// Upsert in yesterday group
				else if (isYesterday(banner.startDate, today)) {
					if (groups["yesterday"]) {
						groups["yesterday"].push(banner)
					} else {
						groups["yesterday"] = [banner]
					}
				}

				// Upsert in exact date
				
				else {
					const newDate = moment(banner.startDate).format("YYYY-MM-DD")
					if (groups[newDate]) {
						groups[newDate].push(banner)
					} else {
						groups[newDate] = [banner]
					}
				}
				return groups
			}, {})
	}
}