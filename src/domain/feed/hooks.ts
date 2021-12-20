import { useServices } from "@core/services";
import { useObservable } from "micro-observables";
import moment from "moment";
import { useEffect } from "react";
import { isToday, isYesterday } from "./business";
import { FeedRecommendation, FeedNotification } from "./type";

export function useRecommendations(): Record<string, FeedRecommendation[]> {
	const { feedService } = useServices();
	const recommendations = useObservable(feedService.recommendations)
	
	useEffect(() => {
		feedService.fetchRecommendations();
	}, []);

	// Groups activities by date.
	return recommendations
		.reduce<Record<string, FeedRecommendation[]>>(function(groups, reco) {
			const today = new Date().toISOString()
			// Upsert in today group
			if (isToday(reco.startDate, today)) {
				if (groups["today"]) {
					groups["today"].push(reco)
					groups["today"].sort((a, b) => b.priority - a.priority)
				} else {
					groups["today"] = [reco]
				}
			}

			// Upsert in yesterday group
			else if (isYesterday(reco.startDate, today)) {
				if (groups["yesterday"]) {
					groups["yesterday"].push(reco)
					groups["yesterday"].sort((a, b) => b.priority - a.priority)
				} else {
					groups["yesterday"] = [reco]
				}
			}

			// Upsert in exact date
			
			else {
				const newDate = moment(reco.startDate).format("YYYY-MM-DD")
				if (groups[newDate]) {
					groups[newDate].push(reco)
					groups[newDate].sort((a, b) => b.priority - a.priority)
				} else {
					groups[newDate] = [reco]
				}
			}
			return groups
		}, {})
}

export function useNotifications(): FeedNotification[] {
	const { feedService } = useServices();
	
	useEffect(() => {
		feedService.fetchNotifications();
	}, []);

	return useObservable(feedService.notifications)
		// Sort by priority CIR-473
		.sort((a, b) => b.priority - a.priority)
}