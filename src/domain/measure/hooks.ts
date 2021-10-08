import { FetchStrategy, useStore } from "@betomorrow/micro-stores";
import { useServices } from "@core/services";
import dayjs from "dayjs";
import { useObservable } from "micro-observables";
import { useEffect } from "react";

export const useActivityData = () => {
	const { measureService } = useServices();
	const data = useObservable(measureService.activityData);

	useEffect(() => {
		measureService.fetchActivityData();
	}, []);

	return data;
};

export const useSleepQualityDailyData = () => {
	const { measureService } = useServices();
	const data = useObservable(measureService.sleepQualityDailyData);

	useEffect(() => {
		measureService.fetchSleepQualityDailyData();
	}, []);

	return data;
};
export const useSleepDurationData = () => {
	const { measureService } = useServices();
	const data = useObservable(measureService.sleepDurationInfos);

	useEffect(() => {
		measureService.fetchSleepDurationInfos();
	}, []);

	return data;
};

export const useWakeUpScore = () => {
	const { measureService } = useServices();
	const score = useObservable(measureService.wakeUpScore);

	useEffect(() => {
		measureService.fetchWakeUpScore();
	}, []);

	return score;
};

export const useGlobalScore = (ymdDay?: string, strategy?: FetchStrategy) => {
	const { measureService } = useServices();
	return useStore(ymdDay ?? dayjs().format("YYYY-MM-DD"), measureService.dailyGlobalScores, strategy);
};
