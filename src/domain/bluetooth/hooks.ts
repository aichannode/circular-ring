import { useServices } from "@core/services";
import { useObservable } from "micro-observables";

export const useBluetoothState = () => useObservable(useServices().bluetoothService.state);
export const useBluetoothEnabled = () => useObservable(useServices().bluetoothService.state);
export const useBluetoothReady = () => useObservable(useServices().bluetoothService.state);
