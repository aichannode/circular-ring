import { useServices } from "@core/services";
import { useObservable } from "micro-observables";
import { useCallback } from "react";

export const useRingBattery = () => useObservable(useServices().ringService.ringBattery);
export const useSyncState = () => useObservable(useServices().ringService.syncState);

export function useLiveData() {
	const { ringService } = useServices();
	const { data, listening } = useObservable(ringService.ringLiveData);
	const start = useCallback(() => ringService.listenLiveData(), []);
	const stop = useCallback(() => ringService.stopLiveData(), []);

	return { data, listening, start, stop };
}
