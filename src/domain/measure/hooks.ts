import { useServices } from "@core/services";
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

export const useWakeUpScore = () => {
	const { measureService } = useServices();
	const score = useObservable(measureService.wakeUpScore);

	useEffect(() => {
		measureService.fetchWakeUpScore();
	}, []);

	return score;
};

export const useGlobalScore = () => {
	const { measureService } = useServices();
	const score = useObservable(measureService.globalScore);

	useEffect(() => {
		measureService.fetchGlobalScore();
	}, []);

	return score;
};
