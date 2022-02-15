import { useServices } from "@core/services";
import { isYesterday } from "@domain/common/utils";
import { useObservable } from "micro-observables";
import moment from "moment";
import { useEffect, useState } from "react";
import { isToday } from "./business";
import { FeedRecommendation, FeedNotification } from "./type";

const POLLING_INTERVAL = 10000;

export function useRecommendations(): { loading: boolean; result: Record<string, FeedRecommendation[]> } {
	const { feedService, appStateService } = useServices();
	const recommendations = useObservable(feedService.recommendations);

	const count = useObservable(appStateService.recommendationsCount);
	const [loading, setLoading] = useState(false);

	const fetchRecommendations = async () => {
		setLoading(true);
		await feedService.fetchRecommendations(appStateService.recommendationsCount.get());
		setLoading(false);
	};

	useEffect(() => {
		const intervalId = setInterval(() => {
			fetchRecommendations();
		}, POLLING_INTERVAL);
		return () => clearInterval(intervalId);
	}, []);

	useEffect(() => {
		fetchRecommendations();
	}, [count]);

	// Groups activities by date.
	const result = recommendations.reduce<Record<string, FeedRecommendation[]>>(function (groups, reco) {
		const today = new Date().toISOString();
		// Upsert in today group
		if (isToday(reco.startDate, today)) {
			if (groups["today"]) {
				groups["today"].push(reco);
			} else {
				groups["today"] = [reco];
			}
		}

		// Upsert in yesterday group
		else if (isYesterday(reco.startDate, today)) {
			if (groups["yesterday"]) {
				groups["yesterday"].push(reco);
			} else {
				groups["yesterday"] = [reco];
			}
		}

		// Upsert in exact date
		else {
			const newDate = moment(reco.startDate).format("YYYY-MM-DD");
			if (groups[newDate]) {
				groups[newDate].push(reco);
			} else {
				groups[newDate] = [reco];
			}
		}
		return groups;
	}, {});

	return { loading, result };
}

export function useNotifications(): FeedNotification[] {
	const { feedService } = useServices();

	useEffect(() => {
		feedService.fetchNotifications();
	}, []);

	return (
		useObservable(feedService.notifications)
			// Sort by priority CIR-473
			.sort((a, b) => b.priority - a.priority)
	);
}
