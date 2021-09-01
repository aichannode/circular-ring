import { BluetoothService } from "@domain/bluetooth/bluetoothService";
import { Observable } from "micro-observables";
import { State } from "react-native-ble-plx";

export enum PairingState {
	DISABLED,
	ENABLED,
	SCANNING,
	ON_PROGRESS,
	FINISHED,
}
export class DeviceService {
	readonly pairingState: Observable<PairingState>;

	constructor(private readonly bluetoothService: BluetoothService) {
		this.pairingState = Observable.select([this.bluetoothService.state], (bleState) => {
			if (bleState === State.PoweredOff) {
				return PairingState.DISABLED;
			}
			return PairingState.ENABLED;
		});
	}
}
