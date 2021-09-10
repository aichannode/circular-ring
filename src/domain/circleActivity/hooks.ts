import { useServices } from "@core/services";
import { useObservable } from "micro-observables";
import { useEffect } from "react";

export const useDailyData = () => {
	const { circleActivityService } = useServices();
	const data = useObservable(circleActivityService.dailyData);

	useEffect(() => {
		circleActivityService.fetchDailyData();
	}, []);

	return data;
};
