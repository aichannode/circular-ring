import { useServices } from "@core/services";
import { RingAlarm } from "@domain/ring/ringAlarm";
import { useObservable } from "micro-observables";
import { useCallback, useEffect } from "react";

export const useAlarms = () => {
	const { circleAlarmService } = useServices();
	const data = useObservable(circleAlarmService.ringAlarms);

	useEffect(() => {
		circleAlarmService.fetchAlarmList();
	}, []);

	return data;
};

export const useCreateAlarm = (alarm: RingAlarm) => {
	const { circleAlarmService } = useServices();
	const create = useCallback((alarm) => circleAlarmService.createAlarm(alarm), [alarm]);

	return create;
};
