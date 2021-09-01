import { BluetoothService } from "@domain/bluetooth/bluetoothService";
import { observable, Observable } from "micro-observables";
import { State } from "react-native-ble-plx";

export enum PairingState {
	DISABLED,
	ENABLED,
	SCANNING,
	ON_PROGRESS,
	FINISHED,
}

const ringServicesUUIDs = [
	"6E400001-B5A3-F393-E0A9-E50E24DCCA9E",
	"6E400002-B5A3-F393-E0A9-E50E24DCCA9E",
	"6E400003-B5A3-F393-E0A9-E50E24DCCA9E",
];
export class DeviceService {
	readonly pairingState: Observable<PairingState>;
	private _devices = observable(new Map<string, string>());

	devices = this._devices.select((devicesMap) => [...devicesMap.values()]);

	constructor(private readonly bluetoothService: BluetoothService) {
		this.pairingState = Observable.select([this.bluetoothService.state], (bleState) => {
			if (bleState === State.PoweredOff) {
				return PairingState.DISABLED;
			}
			return PairingState.ENABLED;
		});
	}

	async startScan() {
		await this.bluetoothService.enable();
		this.log("SCAN STARTED");
		const manager = this.bluetoothService.manager;
		manager.startDeviceScan(ringServicesUUIDs, null, (error, device) => {
			if (error) {
				this.log("Error", error);
				return;
			}
			if (!device) {
				this.log("Unknown device found");
				return;
			}
			const currentDevices = this._devices.get();
			if (!currentDevices.has(device.id)) {
				this._devices.set(new Map(currentDevices).set(device.id, device.name ?? "unknown"));
				this.log("New device", device?.name);
			}
		});
	}

	stopScan() {
		const manager = this.bluetoothService.manager;
		manager.stopDeviceScan();
		this.log("SCAN STOPPED");
	}

	log(...args: unknown[]) {
		console.log("🌐 [DEVICE]", ...args);
	}
}
