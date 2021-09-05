import { base64decode, base64encode, timedPromise } from "@core/utils";
import { BluetoothService } from "@domain/bluetooth/bluetoothService";
import { observable, Observable } from "micro-observables";
import { BleError, Device, State } from "react-native-ble-plx";
import { StoredDevice } from "./device";
import { FavoriteDeviceStorage } from "./favoriteDeviceStorage";

export enum DeviceBondState {
	DISABLED,
	ENABLED,
	SCANNING,
	ON_PROGRESS,
	FINISHED,
}
export enum DeviceConnectionState {
	DISCONNECTED,
	CONNECTING,
	CONNECTED,
}

const NUServiceUUID = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
const RXCharacteristicUUID = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E";
const TXCharacteristicUUID = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E";

const findDeviceTimeout = 20000;

export class DeviceService {
	private _devices = observable(new Map<string, Device>());
	private _connectedDevice = observable<Device | null>(null);
	private _connectionState = observable(DeviceConnectionState.DISCONNECTED);

	private _favoriteDevice: StoredDevice | null = null;

	devices = this._devices.select((devicesMap) => [...devicesMap.values()]);

	readonly bondState: Observable<DeviceBondState>;

	constructor(
		private readonly bluetoothService: BluetoothService,
		private readonly favoriteDeviceStorage: FavoriteDeviceStorage
	) {
		this.bondState = Observable.select(
			[this.bluetoothService.state, this._connectionState],
			(bleState, connectionState) => {
				if (bleState === State.PoweredOff) {
					return DeviceBondState.DISABLED;
				}
				if (connectionState === DeviceConnectionState.DISCONNECTED) {
					return DeviceBondState.ENABLED;
				}
				if (connectionState === DeviceConnectionState.CONNECTING) {
					return DeviceBondState.ON_PROGRESS;
				}
				return DeviceBondState.FINISHED;
			}
		);
	}

	async init() {
		this._favoriteDevice = await this.favoriteDeviceStorage.load();
		if (this._favoriteDevice) {
			this.connectDevice(this._favoriteDevice.name);
		}
	}

	async startScan() {
		await this.bluetoothService.enable();
		this.log("SCAN STARTED");
		const manager = this.bluetoothService.manager;
		manager.startDeviceScan([NUServiceUUID], null, (error, device) => {
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
				this._devices.set(new Map(currentDevices).set(device.id, device));
				this.log("New device", device?.name);
			}
		});
	}

	stopScan() {
		const manager = this.bluetoothService.manager;
		manager.stopDeviceScan();
		this.log("SCAN STOPPED");
	}

	async connect(device: Device) {
		if (!device.name) {
			this.log("Error, trying to connect to unknown device");
			return;
		}
		try {
			this.log("Connecting to device", device.name);
			this._connectionState.set(DeviceConnectionState.CONNECTING);
			await device.connect({ timeout: 20000 });
			this.log("Connection successful to device", device.name);
			await device.discoverAllServicesAndCharacteristics();
			this.log("Services discovered for device", device.name);
			this._connectedDevice.set(device);
			this._connectionState.set(DeviceConnectionState.CONNECTED);
			const storedDevice = { name: device.name };
			this._favoriteDevice = storedDevice;
			this.favoriteDeviceStorage.save(storedDevice);
		} catch (e) {
			this.log("Error connecting to device", e);
			this._connectionState.set(DeviceConnectionState.DISCONNECTED);
		}
	}

	async connectDevice(name: string) {
		this.log("Trying to autoconnect to", name);
		const manager = this.bluetoothService.manager;
		const connectedDevices = await manager.connectedDevices([NUServiceUUID]);
		if (connectedDevices.length > 0) {
			const alreadyConnectedDevice = connectedDevices[0];
			this.log("Already connected to", alreadyConnectedDevice.name);
			this._connectedDevice.set(alreadyConnectedDevice);
			this._connectionState.set(DeviceConnectionState.CONNECTED);
		}
		const device = await this.findDevice(name);
		return this.connect(device);
	}

	async findDevice(name: string): Promise<Device> {
		const manager = this.bluetoothService.manager;

		const scanPromise = new Promise<Device>((resolve, reject) => {
			manager.startDeviceScan([NUServiceUUID], null, (error, device) => {
				if (error) {
					reject(error);
				} else if (device) {
					this.log(`Discovered device named ${device.name} with id ${device.id}`);
					if (device.name === name) {
						resolve(device);
						manager.stopDeviceScan();
					}
				}
			});
		});

		return timedPromise(scanPromise, findDeviceTimeout);
	}

	async listen(message: string, cb: (error: BleError | null, response?: string) => void) {
		const device = this._connectedDevice.get();
		if (!device) {
			this.log("Error : no device connected");
			return;
		}
		device.monitorCharacteristicForService(NUServiceUUID, TXCharacteristicUUID, (err, charac) => {
			if (err) {
				cb(err);
			} else {
				cb(null, base64decode(charac?.value ?? ""));
			}
		});

		await device.writeCharacteristicWithoutResponseForService(
			NUServiceUUID,
			RXCharacteristicUUID,
			base64encode(message)
		);
	}

	async getResponse(message: string) {
		const device = this._connectedDevice.get();
		if (!device) {
			this.log("Error : no device connected");
			return;
		}

		const responsePromise = new Promise<string>((resolve, reject) => {
			const subs = device.monitorCharacteristicForService(NUServiceUUID, TXCharacteristicUUID, (err, charac) => {
				if (err) {
					reject(err);
				} else if (!charac) {
					reject("Empty Characteristic");
				} else {
					resolve(base64decode(charac.value ?? ""));
				}
				subs.remove();
			});
		});

		await device.writeCharacteristicWithoutResponseForService(
			NUServiceUUID,
			RXCharacteristicUUID,
			base64encode(message)
		);

		return await responsePromise;
	}

	log(...args: unknown[]) {
		console.log("🌐 [DEVICE]", ...args);
	}
}
