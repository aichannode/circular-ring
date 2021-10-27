import { getLogger } from "@core/logger/logger";
import { base64decode, base64encode, delay, observableToPromise, timedPromise } from "@core/utils";
import { BluetoothService } from "@domain/bluetooth/bluetoothService";
import { Channel } from "@domain/device/channels";
import { FakeDeviceService } from "@domain/fake/fakeDeviceService";
import { deserializeBattery, RingBattery } from "@domain/ring/ringBattery";
import { deserializeLiveData, RingLiveData, CORRELATION_GOOD_THRESHOLD } from "@domain/ring/ringLiveData";
import { UserService } from "@domain/user/userService";
import { observable, Observable } from "micro-observables";
import { Signal } from "micro-signals";
import { Platform } from "react-native";
import { BleError, Device, ScanMode, State, Subscription } from "react-native-ble-plx";
import { getUTCTimestamp } from "@utils/date";
import { FavoriteDeviceStorage } from "./favoriteDeviceStorage";
import { LocationEnabler } from "./locationEnabler";
import { NamedDevice } from "./namedDevice";

export enum DeviceConnectionState {
	DISCONNECTED = "DISCONNECTED",
	CONNECTING = "CONNECTING",
	CONNECTED = "CONNECTED",
}
export enum DeviceSetupState {
	FINISHED = "FINISHED",
	DISABLED = "DISABLED",
	CONNECTING = "CONNECTING",
	LOCATION_DISABLED = "LOCATION_DISABLED",
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

const locationConfig = { alwaysShow: true, needBle: true };
export class BleDeviceService {
	private logger = getLogger("📟 DeviceService");

	private _onDeviceDisconnectedSubscription: Subscription | null = null;

	private _locationEnabledAndroid = observable(false);
	private _scannedDevices = observable(new Map<string, Device>());
	private _connectedDevice = observable<Device | null>(null);
	private _connectionState = observable(DeviceConnectionState.DISCONNECTED);
	private _scanning = observable(false);
	private _lookingForDevice = observable(false);
	private _monitoring = observable(false);

	private _favoriteDevice = observable<NamedDevice | null>(null);
	private _favoriteDeviceSNU = observable<string | null>(null);

	private _currentRingBattery = observable<RingBattery | null>(null);
	private _batteryListenerUnsubscribe: (() => void) | undefined = undefined;
	private _currentRingLiveData = observable<{ listening: boolean; data?: RingLiveData | null }>({ listening: false });

	scannedDevices = this._scannedDevices.select((devicesMap) => [...devicesMap.values()]);

	readonly setupState: Observable<DeviceSetupState>;
	readonly autoConnectState: Observable<DeviceAutoConnectState>;
	readonly favoriteDevice = this._favoriteDevice.readOnly();
	readonly favoriteDeviceSNU = this._favoriteDeviceSNU.readOnly();

	readonly currentRingBattery = this._currentRingBattery.readOnly();
	readonly currentRingLiveData = this._currentRingLiveData.readOnly();

	private onMessageReceived = new Signal<string>();

	constructor(
		private readonly bluetoothService: BluetoothService,
		private readonly fakeDeviceService: FakeDeviceService,
		private readonly favoriteDeviceStorage: FavoriteDeviceStorage,
		private readonly userService: UserService
	) {
		LocationEnabler.addListener(({ locationEnabled }) => {
			this._locationEnabledAndroid.set(locationEnabled);
		});
		this.checkSettings();
		this.setupState = Observable.select(
			// TODO Use user.device instead of favoriteDevice there
			[
				this.bluetoothService.state,
				this._locationEnabledAndroid,
				this._connectionState,
				this._scanning,
				this.fakeDeviceService.fakeDeviceEnabled,
			],
			(bleState, locationAndroid, connectionState, scanning, faked) => {
				if (connectionState === DeviceConnectionState.CONNECTED || faked) {
					return DeviceSetupState.FINISHED;
				}
				if (bleState === State.PoweredOff) {
					return DeviceSetupState.DISABLED;
				}
				if (Platform.OS === "android" && !locationAndroid) {
					return DeviceSetupState.LOCATION_DISABLED;
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

		this.fakeDeviceService.fakeDeviceEnabled.subscribe(async (enabled) => {
			if (enabled) {
				const debugDevice = "Circular_BeTomorrow";
				this._favoriteDevice.set({ name: debugDevice });
				this._favoriteDeviceSNU.set("fake_snu");
				this.stopScan();
				this.autoConnectFavoriteDevice();
			}
		});
	}

	async init() {
		const loadedDevice = await this.favoriteDeviceStorage.load();
		this.checkSettings();
		this._favoriteDevice.set(loadedDevice);
		if (loadedDevice) {
			this.autoConnectFavoriteDevice();
		}
		this.userService.user.subscribe(async (user) => {
			if (!user) {
				this.disconnect();
			}
		});
	}

	async startScan() {
		if (this._scanning.get()) {
			this.logger.warn("Cannot scan: Already scanning");
			return;
		}
		await this.bluetoothService.enable();
		if (Platform.OS === "android") {
			this.checkSettings();
			if (!this._locationEnabledAndroid.get()) {
				await new Promise<void>((resolve) => {
					this.requestLocation();
					const unsub = this._locationEnabledAndroid.subscribe((enabled) => {
						if (enabled) {
							resolve();
							unsub();
						}
					});
				});
			}
		}
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
			this._onDeviceDisconnectedSubscription = device.onDisconnected((error, disconnectedDevice) =>
				this.handleDeviceDisconnection(error, disconnectedDevice)
			);
			const storedDevice = { name: device.name };
			this._favoriteDevice.set(storedDevice);
			await this.favoriteDeviceStorage.save(storedDevice);
			await this.startMonitoring();
			const snu = await this.getResponse(Channel.SNU);
			if (snu) {
				this._favoriteDeviceSNU.set(snu);
			}
			await this.write(`${Channel.CALENDAR}${getUTCTimestamp()}`);
			this.logger.info("🕒 Time set to device", device.name, getUTCTimestamp());
			await this.listenBattery();
		} catch (e) {
			this.logger.error("Error connecting to device", e);
			this._connectionState.set(DeviceConnectionState.DISCONNECTED);
			throw e;
		}
	}

	private handleDeviceDisconnection(error: BleError | null, device: Device) {
		const connectedDevice = this._connectedDevice.get();
		if (!connectedDevice) {
			return;
		}
		this.logger.warn(`Lost connection with device ${device.id} / ${device.name}`, error);
		if (connectedDevice?.name && connectedDevice.id === device.id) {
			this._connectionState.set(DeviceConnectionState.DISCONNECTED);
			this._connectedDevice.set(null);
			this._onDeviceDisconnectedSubscription?.remove();
			this._onDeviceDisconnectedSubscription = null;
			this._batteryListenerUnsubscribe?.();
			this._currentRingBattery.set(null);
			this.logger.info("Trying to reconnect to", connectedDevice.name);
			this.autoConnectFavoriteDevice();
		} else {
			this.logger.warn("Disconnected from unknown device");
		}
	}

	async autoConnectFavoriteDevice() {
		const name = this._favoriteDevice.get()?.name;
		if (name === undefined) {
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
			const device = await this.findFavoriteDevice();
			if (device) {
				return this.connect(device);
			}
		} finally {
			this._lookingForDevice.set(false);
		}
	}

	async findFavoriteDevice(): Promise<Device | undefined> {
		const name = this._favoriteDevice.get()?.name;
		if (name === undefined) {
			return undefined;
		}
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
					this.logger.info(`Discovered device named ${device.name} with id ${device.id} ... ${JSON.stringify(device)}`);
					if (device.name === name) {
						this.stopScan();
						resolve(device);
					}
				}
			});
		});

		try {
			return await timedPromise(scanPromise, findDeviceTimeout);
		} catch (e) {
			this.logger.warn("Device not found:", e, "retrying in 10 seconds ");
			this.stopScan();
			await delay(scanRetryTimeout);
			return this.findFavoriteDevice();
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

		await this.writeToDevice(device, channel);

		return () => this.onMessageReceived.remove(listener);
	}

	async write(message: string) {
		const device = this._connectedDevice.get();
		if (!device) {
			this.logger.error("Error : no device connected");
			return;
		}
		await this.writeToDevice(device, message);
	}

	private async writeToDevice(device: Device, message: string) {
		await delay(100);
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

		await this.writeToDevice(device, message);

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
				this.logger.debug("✅ BleDeviceService | decodedOutput : ", decodedOutput);
				this.onMessageReceived.dispatch(decodedOutput);
			}
		});
		this._monitoring.set(true);

		return subscription;
	}

	async disconnect() {
		const device = this._connectedDevice.get();
		await this.forgetBeforeDisconnection();
		if (!device) {
			this.logger.info("Already disconnected");
			return;
		}
		this.logger.info("Disconnecting from device", device.name);
		await device.cancelConnection();
		this.logger.info(`Disconnection from device ${device.name} succeeded`);
	}

	async factoryResetCurrentRing() {
		const device = this._connectedDevice.get();
		if (!device) {
			this.logger.warn("No connected device");
			throw Error("No connected device");
		}
		this.logger.info("Factory-reset device", device.name);
		await this.forgetBeforeDisconnection();
		await this.writeToDevice(device, Channel.FRS);
	}

	private async forgetBeforeDisconnection() {
		this._connectedDevice.set(null);
		this._connectionState.set(DeviceConnectionState.DISCONNECTED);
		this._onDeviceDisconnectedSubscription?.remove();
		this._onDeviceDisconnectedSubscription = null;
		this._favoriteDevice.set(null);
		this._favoriteDeviceSNU.set(null);
		this._currentRingBattery.set(null);
		this._batteryListenerUnsubscribe?.();
		await this.favoriteDeviceStorage.clear();
	}

	requestLocation() {
		LocationEnabler.requestResolutionSettings(locationConfig);
	}
	checkSettings() {
		LocationEnabler.checkSettings(locationConfig);
	}

	flushRingLiveData() {
		this._currentRingLiveData.set({ listening: false, data: null });
	}
	listenLiveData() {
		this._currentRingLiveData.set({ listening: true });

		return this.listen("FBL1", Channel.LIVE, (value) => {
			if (value) {
				const deserializedData = deserializeLiveData(value);
				if (deserializedData) {
					console.log("Deserialized Data", deserializedData);
					this._currentRingLiveData.update((c) => {
						console.log("C", c);
						const maxHeartRate = 0;
						c.data && deserializedData
							? Math.max(deserializedData.heartRate!, c.data.heartRate!)
							: deserializedData.heartRate;

						// if (maxHeartRate === undefined || isNaN(maxHeartRate)) maxHeartRate: c?.data?.heartRate;
						console.log("MAXHEARTRATE", maxHeartRate);

						if (deserializedData?.correlation < CORRELATION_GOOD_THRESHOLD) {
							console.log("LOW CORRELATION");
							console.log("LOW CORRELATION");
							console.log("LOW CORRELATION");
							console.log("LOW CORRELATION");
							console.log("LOW CORRELATION");
							console.log("LOW CORRELATION");

							return { ...c, data: { ...c?.data, correlation: deserializedData.correlation } };
						}
						return { ...c, data: { ...deserializedData, maxHeartRate } };
					});
				}
			}
		});
	}

	stopLiveData() {
		this._currentRingLiveData.update((c) => ({ ...c, listening: false }));
		return this.write("FBL0");
	}

	async listenBattery() {
		this._batteryListenerUnsubscribe = await this.listen(Channel.BATTERY, Channel.BATTERY, (value) => {
			if (value) {
				this._currentRingBattery.set(deserializeBattery(value));
			}
		});
	}

	stopListenBattery() {
		this._batteryListenerUnsubscribe?.();
	}
}
