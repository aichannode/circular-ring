import { useServices } from "@core/services";
import { useObservable } from "micro-observables";
import { useCallback } from "react";

export const useRingBattery = () => useObservable(useServices().ringService.currentRingBattery);
export const useSyncState = () => useObservable(useServices().ringService.currentRingSyncState);

export function useLiveData() {
	const { ringService } = useServices();
	const { data, listening } = useObservable(ringService.currentRingLiveData);
	const start = useCallback(() => ringService.listenLiveData(), []);
	const stop = useCallback(() => ringService.stopLiveData(), []);

	return { data, listening, start, stop };
}
