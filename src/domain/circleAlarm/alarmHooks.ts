import { useServices } from "@core/services";
import { useObservable } from "micro-observables";
import { useEffect } from "react";

export const useAlarms = () => {
	const { circleAlarmService } = useServices();
	const data = useObservable(circleAlarmService.ringAlarms);

	useEffect(() => {
		circleAlarmService.fetchAlarmList();
	}, []);

	return data;
};
