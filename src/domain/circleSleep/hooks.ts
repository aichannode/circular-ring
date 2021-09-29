import { useServices } from "@core/services";
import { useObservable } from "micro-observables";
import { useEffect } from "react";

export const useSleepQualityDailyData = () => {
	const { circleSleepService } = useServices();
	const data = useObservable(circleSleepService.sleepQualityDailyData);

	useEffect(() => {
		circleSleepService.fetchSleepQualityDailyData();
	}, []);

	return data;
};
