import { useServices } from "@core/services";
import { useObservable } from "micro-observables";
import { useCallback, useEffect, useState } from "react";

export const useAlarms = () => {
	const { circleAlarmService } = useServices();
	const alarms = useObservable(circleAlarmService.ringAlarms);
	const [loading, setLoading] = useState(false);

	const loadAlarms = useCallback(async () => {
		setLoading(true);
		await circleAlarmService.fetchAlarmList();
		setLoading(false);
	}, []);

	return { loading, alarms, loadAlarms };
};
