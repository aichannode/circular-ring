import { FetchStrategy, useStore } from "@betomorrow/micro-stores";
import { useServices } from "@core/services";
import dayjs from "dayjs";
import { useObservable } from "micro-observables";
import { useEffect } from "react";

export const useActivityData = (ymdDay?: string) => {
	const { measureService } = useServices();
	return useStore(ymdDay ?? dayjs().format("YYYY-MM-DD"), measureService.activityData, FetchStrategy.First);
};

export const useSleepQualityDailyData = (ymdDay?: string) => {
	const { measureService } = useServices();
	return useStore(ymdDay ?? dayjs().format("YYYY-MM-DD"), measureService.sleepQualityData, FetchStrategy.First);
};
export const useSleepDurationData = (ymdDay?: string) => {
	const { measureService } = useServices();
	return useStore(ymdDay ?? dayjs().format("YYYY-MM-DD"), measureService.sleepDurationInfos, FetchStrategy.First);
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
