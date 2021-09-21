import { getLogger } from "@core/logger/logger";
import { base64decode, base64encode, delay, observableToPromise, timedPromise } from "@core/utils";
import { BluetoothService } from "@domain/bluetooth/bluetoothService";
import { observable, Observable } from "micro-observables";
import { Signal } from "micro-signals";
import { Device, ScanMode, State } from "react-native-ble-plx";
import { StoredDevice } from "./device";
import { FavoriteDeviceStorage } from "./favoriteDeviceStorage";

export enum DeviceConnectionState {
	DISCONNECTED = "DISCONNECTED",
	CONNECTING = "CONNECTING",
	CONNECTED = "CONNECTED",
}
export enum DeviceSetupState {
	FINISHED = "FINISHED",
	DISABLED = "DISABLED",
	CONNECTING = "CONNECTING",
	READY_TO_SCAN = "READY_TO_SCAN",
	SCANNING = "SCANNING",
}
export enum DeviceAutoConnectState {
	DISABLED = "DISABLED",
	DISCONNECTED = "DISCONNECTED",
	SEARCHING = "SEARCHING",
	CONNECTING = "CONNECTING",
	CONNECTED = "CONNECTED",
}

const NUServiceUUID = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
const RXCharacteristicUUID = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E";
const TXCharacteristicUUID = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E";

const findDeviceTimeout = 20000;
const scanRetryTimeout = 10000;
export class DeviceService {
	private logger = getLogger("📟 DeviceService");

	private _scannedDevices = observable(new Map<string, Device>());
	private _connectedDevice = observable<Device | null>(null);
	private _connectionState = observable(DeviceConnectionState.DISCONNECTED);
	private _scanning = observable(false);
	private _lookingForDevice = observable(false);
	private _monitoring = observable(false);

	private _favoriteDevice = observable<StoredDevice | null>(null);

	scannedDevices = this._scannedDevices.select((devicesMap) => [...devicesMap.values()]);

	readonly setupState: Observable<DeviceSetupState>;
	readonly autoConnectState: Observable<DeviceAutoConnectState>;

	private onMessageReceived = new Signal<string>();

	constructor(
		private readonly bluetoothService: BluetoothService,
		private readonly favoriteDeviceStorage: FavoriteDeviceStorage
	) {
		this.setupState = Observable.select(
			// TODO Use user.device instead of favoriteDevice there
			[this.bluetoothService.state, this._connectionState, this._scanning, this._favoriteDevice],
			(bleState, connectionState, scanning, favorite) => {
				if (connectionState === DeviceConnectionState.CONNECTED || !!favorite) {
					return DeviceSetupState.FINISHED;
				}
				if (bleState === State.PoweredOff) {
					return DeviceSetupState.DISABLED;
				}
				if (connectionState === DeviceConnectionState.CONNECTING) {
					return DeviceSetupState.CONNECTING;
				}
				if (scanning) {
					return DeviceSetupState.SCANNING;
				}
				return DeviceSetupState.READY_TO_SCAN;
			}
		);

		this.autoConnectState = Observable.select(
			[this.bluetoothService.state, this._connectionState, this._lookingForDevice],
			(bleState, connectionState, looking) => {
				if (bleState === State.PoweredOff) {
					return DeviceAutoConnectState.DISABLED;
				}
				if (connectionState === DeviceConnectionState.CONNECTED) {
					return DeviceAutoConnectState.CONNECTED;
				}
				if (connectionState === DeviceConnectionState.CONNECTING) {
					return DeviceAutoConnectState.CONNECTING;
				}
				if (looking) {
					return DeviceAutoConnectState.SEARCHING;
				}
				return DeviceAutoConnectState.DISCONNECTED;
			}
		);
	}

	async init() {
		const loadedDevice = await this.favoriteDeviceStorage.load();
		this._favoriteDevice.set(loadedDevice);

		if (loadedDevice) {
			this.autoConnectDevice(loadedDevice.name);
		}
	}

	async startScan() {
		if (this._scanning.get()) {
			this.logger.warn("Cannot scan: Already scanning");
			return;
		}
		await this.bluetoothService.enable();
		const manager = this.bluetoothService.manager;
		this.logger.info("SCAN STARTED");
		this._scanning.set(true);
		manager.startDeviceScan([NUServiceUUID], null, (error, device) => {
			if (error) {
				this.logger.error(error);
				this.stopScan();
				return;
			}
			if (!device) {
				this.logger.error("Unknown device found");
				return;
			}
			const currentDevices = this._scannedDevices.get();
			if (!currentDevices.has(device.id)) {
				this._scannedDevices.set(new Map(currentDevices).set(device.id, device));
				this.logger.info("New device", device?.name, device?.id);
			}
		});
	}

	stopScan() {
		const manager = this.bluetoothService.manager;
		manager.stopDeviceScan();
		this.logger.info("SCAN STOPPED");
		this._scanning.set(false);
	}

	async connect(device: Device) {
		if (!device.name) {
			this.logger.error("Error: trying to connect to unknown device");
			return;
		}
		try {
			this.logger.info("Connecting to device", device.name);
			this._connectionState.set(DeviceConnectionState.CONNECTING);
			await device.connect({ timeout: 20000 });
			this.logger.info("Connection successful to device", device.name);
			await device.discoverAllServicesAndCharacteristics();
			this.logger.info("Services discovered for device", device.name);
			this._connectedDevice.set(device);
			this._connectionState.set(DeviceConnectionState.CONNECTED);
			const storedDevice = { name: device.name };
			this._favoriteDevice.set(storedDevice);
			await this.favoriteDeviceStorage.save(storedDevice);
			await this.startMonitoring();
		} catch (e) {
			this.logger.error("Error connecting to device", e);
			this._connectionState.set(DeviceConnectionState.DISCONNECTED);
			throw e;
		}
	}

	async autoConnectDevice(name: string) {
		if (this.setupState.get() !== DeviceSetupState.FINISHED) {
			this.logger.error("Error: can note autoconnect while setup is not finished");
			return;
		}
		this.logger.info("Trying to autoconnect to", name);
		await this.bluetoothService.enable();
		this._lookingForDevice.set(true);
		const manager = this.bluetoothService.manager;
		try {
			const connectedDevices = await manager.connectedDevices([NUServiceUUID]);
			if (connectedDevices.length > 0) {
				const alreadyConnectedDevice = connectedDevices[0];
				this.logger.info("Already connected to", alreadyConnectedDevice.name);
				this._connectedDevice.set(alreadyConnectedDevice);
				this._connectionState.set(DeviceConnectionState.CONNECTED);
			}
			const device = await this.findDevice(name);
			return this.connect(device);
		} finally {
			this._lookingForDevice.set(false);
		}
	}

	async findDevice(name: string): Promise<Device> {
		const manager = this.bluetoothService.manager;

		const scanPromise = new Promise<Device>((resolve, reject) => {
			if (this._scanning.get()) {
				this.logger.error("Cannot find device: Already scanning");
				reject("Already Scanning");
			}
			this.logger.info("Scanning to autoconnect to", name);
			this._scanning.set(true);
			manager.startDeviceScan([NUServiceUUID], { scanMode: ScanMode.LowLatency }, (error, device) => {
				if (error) {
					this.logger.error("Error during scan", error);
					this.stopScan();
					reject(error);
				} else if (device) {
					this.logger.info(`Discovered device named ${device.name} with id ${device.id}`);
					if (device.name === name) {
						this.stopScan();
						resolve(device);
					}
				}
			});
		});

		try {
			const deviceFound = await timedPromise(scanPromise, findDeviceTimeout);
			return deviceFound;
		} catch (e) {
			this.logger.warn("Device not found:", e, "retrying in 10 seconds ");
			this.stopScan();
			await delay(scanRetryTimeout);
			return this.findDevice(name);
		}
	}

	async listen(channel: string, returnChannel: string, cb: (response: string) => void) {
		const device = this._connectedDevice.get() ?? (await observableToPromise(this._connectedDevice));
		const monitoring = this._monitoring.get() || (await observableToPromise(this._monitoring));
		if (!device) {
			this.logger.error("Error : no device connected");
			throw "No Device";
		}
		if (!monitoring) {
			this.logger.error("Error, not monitoring");
			throw "Not monitoring";
		}

		this.logger.info("Listening to", channel, "->", returnChannel);

		const listener = (output: string) => {
			if (output.startsWith(returnChannel)) {
				cb(output);
			}
		};

		this.onMessageReceived.add(listener);

		await device.writeCharacteristicWithoutResponseForService(
			NUServiceUUID,
			RXCharacteristicUUID,
			base64encode(channel)
		);

		return () => this.onMessageReceived.remove(listener);
	}

	async write(message: string) {
		const device = this._connectedDevice.get();
		if (!device) {
			this.logger.error("Error : no device connected");
			return;
		}
		this.logger.info("Writing...", message);
		await device.writeCharacteristicWithoutResponseForService(
			NUServiceUUID,
			RXCharacteristicUUID,
			base64encode(message)
		);
	}

	async getResponse(
		message: string,
		returnChannel: string = message,
		deserialize = (response: string) => response.slice(returnChannel.length)
	) {
		const device = this._connectedDevice.get();
		if (!device) {
			this.logger.error("Error : no device connected");
			return;
		}
		const monitoring = this._monitoring.get() || (await observableToPromise(this._monitoring));
		if (!monitoring) {
			this.logger.error("Error, not monitoring");
			throw "Not monitoring";
		}

		const responsePromise = new Promise<string>((resolve) => {
			const listener = (output: string) => {
				if (output.startsWith(returnChannel)) {
					resolve(deserialize(output));
					this.onMessageReceived.remove(listener);
				}
			};
			this.onMessageReceived.add(listener);
		});

		await device.writeCharacteristicWithoutResponseForService(
			NUServiceUUID,
			RXCharacteristicUUID,
			base64encode(message)
		);

		return await responsePromise;
	}

	private async startMonitoring() {
		const device = this._connectedDevice.get() ?? (await observableToPromise(this._connectedDevice));

		if (!device) {
			this.logger.error("Error : no device connected");
			return;
		}
		this.logger.info("START MONITORING");
		const subscription = device.monitorCharacteristicForService(NUServiceUUID, TXCharacteristicUUID, (err, charac) => {
			if (err) {
				this._monitoring.set(false);
				this.logger.error("Error during monitoring", err);
				subscription.remove();
			} else {
				const decodedOutput = base64decode(charac?.value ?? "");
				this.logger.debug("------------------", decodedOutput);
				this.onMessageReceived.dispatch(decodedOutput);
			}
		});
		this._monitoring.set(true);

		return subscription;
	}
}
