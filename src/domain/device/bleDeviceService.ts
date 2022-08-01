import { getLogger } from "@core/logger/logger";
import { base64decode, base64encode, delay, observableToPromise, timedPromise } from "@core/utils";
import { AppStateService } from "@domain/appState/appStateService";
import { BluetoothService } from "@domain/bluetooth/bluetoothService";
import { Channel } from "@domain/device/channels";
import { FakeDeviceService } from "@domain/fake/fakeDeviceService";
import { NamedUserRing } from "@domain/ring/ring";
import { RingApi } from "@domain/ring/ringApi";
import { deserializeBattery, RingBattery } from "@domain/ring/ringBattery";
import { deserializeLiveData, RingLiveData } from "@domain/ring/ringLiveData";
import { getUTCTimestamp } from "@utils/date";
import { observable, Observable } from "micro-observables";
import { Signal } from "micro-signals";
import { Platform } from "react-native";
import { BleError, Device, ScanMode, State, Subscription } from "react-native-ble-plx";
import RNFetchBlob from "react-native-blob-util";
import RNFS from "react-native-fs";
import { NordicDFU } from "react-native-nordic-dfu";
import { FavoriteDeviceStorage } from "./favoriteDeviceStorage";
import { LocationEnabler } from "./locationEnabler";
import { NamedDevice } from "./namedDevice";
import { UserDevice } from "./userDevice";
import * as Sentry from "@sentry/react-native";
import BleManager from "react-native-ble-manager";

const FB = RNFetchBlob.config({
	fileCache: true,
	appendExt: "zip",
	timeout: 3000,
});

export enum DeviceConnectionState {
	DISCONNECTED = "DISCONNECTED",
	CONNECTING = "CONNECTING",
	CONNECTED = "CONNECTED",
	UPDATE = "UPDATE",
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
	UPDATE = "UPDATE",
}

interface I_Disconnect {
	dissociate: boolean;
	ring?: NamedUserRing;
}

interface I_UpdateState {
	status: string;
	progress: number;
	error: boolean;
}

export const UpdateState = {
	IDLE: { status: "IDLE", progress: 0, error: false },
	START_UPDATE_FLOW: { status: "START UPDATE FLOW", progress: 1, error: false },
	DOWNLOADING_FIRMWARE: { status: "DOWNLOADING FIRMWARE", progress: 2, error: false },
	SETTING_RING_IN_DFU_MODE: { status: "SETTING RING IN DFU MODE", progress: 4, error: false },
	SCANNING_DFU_RING: { status: "SCANNING DFU RING", progress: 6, error: false },
	FOUND_DFU_RING: { status: "FOUND DFU RING", progress: 8, error: false },
	SENDING_FIRMWARE_OVER_BLUETOOTH: { status: "SENDING FIRMWARE OVER BLUETOOTH", progress: 10, error: false },
	RECONNECTING: { status: "RECONNECTING", progress: 15, error: false },
	RECONNECTED: { status: "RECONNECTED", progress: 20, error: false },
	UPDATE_SUCCESS: { status: "UPDATE SUCCESS", progress: 20, error: false },
	UPDATE_ERROR_SCANNING: { status: "UPDATE ERROR SCANNING", progress: -1, error: true },
	UPDATE_ERROR_DOWNLOAD_FAILED: { status: "UPDATE ERROR DOWNLOAD FAILED", progress: -1, error: true },
	UPDATE_ERROR_SHA1_INVALID: { status: "UPDATE ERROR SHA1 INVALID", progress: -1, error: true },
	UPDATE_ERROR_RING_DISCONNECTION: { status: "UPDATE ERROR RING DISCONNECTION", progress: -1, error: true },
	UPDATE_ERROR_SETTING_RING_IN_DFU_MODE: { status: "UPDATE ERROR SETTING RING IN DFU MODE", progress: -1, error: true },

	UPDATE_ERROR_SENDING_FIRMWARE_OVER_BLUETOOTH: {
		status: "UPDATE ERROR SENDING FIRMWARE OVER BLUETOOTH",
		progress: -1,
		error: true,
	},
};

const DFUNUServiceUUID = "0000FE59-0000-1000-8000-00805F9B34FB";

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
	private _connectedDeviceSnu = observable<string | null>(null);
	private _connectionState = observable(DeviceConnectionState.DISCONNECTED);
	private _scanning = observable(false);
	private _lookingForDevice = observable(false);
	private _monitoring = observable(false);

	private _favoriteDevice = observable<NamedDevice | null>(null);
	private _favoriteDeviceSNU = observable<string | null>(null);

	private _userDevices = observable<UserDevice[] | null>(null);

	private _currentRingBattery = observable<RingBattery | null>(null);
	private _batteryListenerUnsubscribe: (() => void) | undefined = undefined;
	private _currentRingLiveData = observable<{ listening: boolean; data?: RingLiveData | null }>({ listening: false });
	monitoring = this._monitoring.readOnly();
	updateState = observable<I_UpdateState>(UpdateState.IDLE);
	scannedDevices = this._scannedDevices.select((devicesMap) => [...devicesMap.values()]);

	readonly connectedDevice = this._connectedDevice.readOnly();
	readonly connectedDeviceSnu = this._connectedDeviceSnu.readOnly();
	setupState: Observable<DeviceSetupState>;
	readonly autoConnectState: Observable<DeviceAutoConnectState>;
	favoriteDevice = this._favoriteDevice;
	favoriteDeviceSNU = this._favoriteDeviceSNU;
	readonly userDevices = this._userDevices.readOnly();

	readonly currentRingBattery = this._currentRingBattery.readOnly();
	readonly currentRingLiveData = this._currentRingLiveData.readOnly();

	private onMessageReceived = new Signal<string>();
	connectionState = this._connectionState;

	constructor(
		private readonly bluetoothService: BluetoothService,
		private readonly fakeDeviceService: FakeDeviceService,
		private readonly favoriteDeviceStorage: FavoriteDeviceStorage,
		private readonly ringApi: RingApi,
		private readonly appStateService: AppStateService
	) {
		this._favoriteDevice.subscribe((device) => {
			this.logger.info("_favoriteDevice", device);
			if (device) this.favoriteDeviceStorage.save(device);
			return device;
		});

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
				if (bleState === State.PoweredOff || bleState === State.Unauthorized) {
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
				if (connectionState === DeviceConnectionState.UPDATE) {
					return DeviceAutoConnectState.UPDATE;
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
		this.checkSettings();
		this._favoriteDevice.set(loadedDevice);
		if (loadedDevice) {
			this.autoConnectFavoriteDevice();
		}
	}

	async reset() {
		this.disconnect({ dissociate: false });
		this._scannedDevices.set(new Map<string, Device>());
		this._connectedDevice.set(null);
		this._connectionState.set(DeviceConnectionState.DISCONNECTED);
		this._scanning.set(false);
		this._lookingForDevice.set(false);
		this._monitoring.set(false);
		this._userDevices.set(null);
		this._currentRingBattery.set(null);
		this._favoriteDevice.set(null);
		this._favoriteDeviceSNU.set(null);
		this._connectedDeviceSnu.set(null);
		this.favoriteDeviceStorage.clear();
	}

	async setFavoriteDeviceName(name: string) {
		await this.favoriteDeviceStorage.save({ name });
		this._favoriteDevice.set({ name });
	}

	async startScan() {
		if (this._scanning.get()) {
			this.logger.warn("Cannot scan: Already scanning");
			this.stopScan(); // get main priority when scanning for new ring
			// return;
		}
		await this.bluetoothService.enable();
		await BleManager.start({ showAlert: false });

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
			if (currentDevices.has(device.id) && currentDevices.get(device.id)?.name !== device.name) {
				this._scannedDevices.set(new Map(currentDevices).set(device.id, device));
			}
		});
	}

	async startDfuMode() {
		let firmwareFile = null;
		if (this.updateState.get().error) {
			await this.updateState.set(UpdateState.IDLE);
			return;
		}
		this.updateState.set(UpdateState.START_UPDATE_FLOW);
		this.logger.info("START DFU MODE");
		this._connectionState.set(DeviceConnectionState.UPDATE);

		try {
			await this.write("CTR1"); // send DFU signal
			this.updateState.set(UpdateState.SETTING_RING_IN_DFU_MODE);
		} catch (err) {
			this.updateState.set(UpdateState.UPDATE_ERROR_SETTING_RING_IN_DFU_MODE);
		}
		this.updateState.set(UpdateState.DOWNLOADING_FIRMWARE);

		try {
			const latestFirmware = await this.ringApi.getLatestFirmware();
			firmwareFile = (await FB.fetch("GET", latestFirmware.fileUrl)).path();
			const hashOfFMW = await RNFS.hash(firmwareFile, "sha1");
			if (hashOfFMW !== latestFirmware.hash) {
				this.updateState.set(UpdateState.UPDATE_ERROR_DOWNLOAD_FAILED);
				throw Error("FIRMWARE DONT MATCH");
			}
			this.startDFUScan(firmwareFile);
		} catch (err) {
			this.updateState.set(UpdateState.UPDATE_ERROR_DOWNLOAD_FAILED);
			return null;
		}
	}

	async startDFUScan<I_startDFUScan>(firmwareFile: string | null): Promise<I_startDFUScan | undefined> {
		// check for enaled Geoloc
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
		await this.bluetoothService.enable();
		const DFUScanPromise = new Promise<Device>((resolve, reject) => {
			this.updateState.set(UpdateState.SCANNING_DFU_RING);
			if (this._scanning.get()) {
				this.logger.error("DFU Cannot find device: Already scanning");
				reject("DFU  Already Scanning");
			}
			this.logger.info("DFU  Scanning to autoconnect to", "Circular Update");
			this._scanning.set(true);
			const manager = this.bluetoothService.manager;

			manager.startDeviceScan([DFUNUServiceUUID], { scanMode: ScanMode.LowLatency }, (error, device) => {
				if (error) {
					this.stopScan();
					this.updateState.set(UpdateState.UPDATE_ERROR_SCANNING);
					reject(error);
				} else if (device) {
					this.logger.info(
						`DFU Discovered device named ${device.name} with id ${device.id} ... ${JSON.stringify(device)}`
					);
					if (device.name === "Circular Update") {
						this.stopScan();
						this.updateState.set(UpdateState.FOUND_DFU_RING);
						resolve(device);
					}
				}
			});
		});

		try {
			const dfuDevice = await timedPromise(DFUScanPromise, findDeviceTimeout);
			try {
				this.updateState.set(UpdateState.SENDING_FIRMWARE_OVER_BLUETOOTH);
				await NordicDFU.startDFU({
					deviceAddress: dfuDevice?.id,
					deviceName: dfuDevice?.name ? dfuDevice.name : "Circular Update",
					filePath: Platform.OS === "android" ? firmwareFile : "file://" + firmwareFile,
				});
				this.updateState.set(UpdateState.RECONNECTING);
				this.autoConnectFavoriteDevice();
			} catch (err) {
				this.updateState.set(UpdateState.UPDATE_ERROR_SENDING_FIRMWARE_OVER_BLUETOOTH);
				this.logger.error("Update error", err);
				Sentry.captureException(err);
			}
		} catch (e) {
			this.logger.warn("Device not found:", e, "retrying in 10 seconds ");
			this.stopScan();
			await delay(scanRetryTimeout);
			return this.startDFUScan(firmwareFile);
		}
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
			this._onDeviceDisconnectedSubscription = device.onDisconnected((error, disconnectedDevice) => {
				this.handleDeviceDisconnection(error, disconnectedDevice);
			});
			await this.startMonitoring();
			const snu = await this.getResponse(Channel.SNU);
			this._connectedDeviceSnu.set(snu ?? "000000000000");
		} catch (e) {
			this.logger.error("Error connecting to device", e, JSON.stringify(e));
			this._connectionState.set(DeviceConnectionState.DISCONNECTED);
			this.autoConnectFavoriteDevice();
			throw e;
		}
	}

	async initializeDevice() {
		const device = this._connectedDevice.get();
		if (!device) {
			return;
		}
		const snu = this._connectedDeviceSnu.get();
		if (!device) {
			throw new Error("No SNU found");
		}
		await this.write(`${Channel.CALENDAR}${getUTCTimestamp()}`);
		this.logger.info("🕒 Time set to device", device.name, getUTCTimestamp());
		await this.listenBattery();
		await this.write(Channel.MODE + `${this.appStateService.performanceMode.get() ? "1" : "0"}`);
		const firmware = await this.getResponse(Channel.FIRMWARE_VERSION);
		this.logger.info("🔧 Firmware Version", firmware);
		if (
			this.appStateService.userRings.get().find((userRing: NamedUserRing) => userRing.name === device.name) ===
			undefined
		) {
			this.ringApi.getLatestFirmware();
			this.appStateService.userRings.update((userRing) => {
				const rings = userRing.map((ring) => ({ ...ring, connected: false }));
				const newRing = {
					name: device.name ? device.name : undefined,
					id: snu ? snu : "000000000000",
					ringId: device.id,
					firmware,
					connected: true,
					lastSyncDate: new Date(),
					userId: undefined,
				};
				return [...rings, newRing];
			});
		} else {
			this.appStateService.userRings.update((userRing) => {
				return userRing.map((userRing) => ({
					...userRing,
					connected: userRing.name === device.name ? true : false,
				}));
			});
		}
	}

	async saveDeviceAsFavorite(name?: string, snu?: string) {
		if (!name) {
			const device = this.connectedDevice.get();
			if (!device) {
				return;
			}
			name = device.name ?? undefined;
		}

		if (!name) {
			throw Error("Bad device name");
		}

		const storedDevice = { name: name };
		await this.favoriteDeviceStorage.save(storedDevice);
		this._favoriteDevice.set(storedDevice);
		this._favoriteDeviceSNU.set(snu ?? this._connectedDeviceSnu.get());
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
			if (this.updateState.get().status !== UpdateState.IDLE.status) {
				// this.startDFUScan();
			} else {
				this.logger.info("Trying to reconnect to", connectedDevice.name);
				this.autoConnectFavoriteDevice();
			}
		} else {
			this.logger.warn("Disconnected from unknown device");
		}
		this.appStateService.userRings.update((userRing) => {
			return userRing.map((userRing) => ({ ...userRing, connected: false }));
		});
	}

	async autoConnectFavoriteDevice() {
		this.logger.info("autoConnectFavoriteDevice");
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
				const connect = await this.connect(device);
				// FIXME Should be good to check that the ring is still in the user's inventory ? (by using registerRing)
				await this.initializeDevice();
				// this._connectionState.set(DeviceConnectionState.CONNECTED);
				return connect;
			}
		} finally {
			this._lookingForDevice.set(false);
		}
	}

	async findFavoriteDevice(): Promise<Device | undefined> {
		this.logger.info("findFavoriteDevice", this.connectedDevice.get());
		const name = this._favoriteDevice.get()?.name;
		if (
			name === undefined ||
			this._connectionState.get() === DeviceConnectionState.UPDATE ||
			this.connectedDevice.get()
		) {
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
					this.logger.info(`Discovered device named ${device.name} with id ${device.id}`);
					if (device.name === name) {
						if (this.updateState.get().status === UpdateState.RECONNECTING.status)
							this.updateState.set(UpdateState.UPDATE_SUCCESS);
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

		const listener = async (output: string) => {
			if (output.startsWith(returnChannel)) {
				await cb(output);
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
			throw Error("Error : no device connected");
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
				this.onMessageReceived = new Signal();
				this.logger.error("Error during monitoring", err);
				subscription.remove();
			} else {
				const decodedOutput = base64decode(charac?.value ?? "");
				this.logger.debug("✅ BleDeviceService | decodedOutput : ", decodedOutput);
				this.onMessageReceived.dispatch(decodedOutput);
			}
		});
		this._monitoring.set(true);

		return subscription;
	}

	async disconnect(options: I_Disconnect) {
		this._scannedDevices.set(new Map()); //  flush scanned device on dissociate or factory reset
		const device = this._connectedDevice.get();
		await this.forgetBeforeDisconnection();
		if (options.dissociate) {
			this.appStateService.userRings.update((userRing) => {
				if (options.ring) {
					return userRing.filter((ring) => ring.name !== options.ring?.name);
				} else {
					return userRing.filter((ring) => ring.name !== device?.name);
				}
			});
		} else {
			this.appStateService.userRings.update((userRing) => {
				return userRing.map((userRing) => ({ ...userRing, connected: false }));
			});
		}
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
		this.appStateService.userRings.update((userRing) => {
			return userRing.filter((ring) => ring.name !== device?.name);
		});
		this.logger.info("Factory-reset device", device.name);
		await this.forgetBeforeDisconnection();
		await this.writeToDevice(device, Channel.FRS);
		this._favoriteDevice.set({ name: "noring" });
	}

	private async forgetBeforeDisconnection() {
		this._connectedDevice.set(null);
		this._connectionState.set(DeviceConnectionState.DISCONNECTED);
		this._onDeviceDisconnectedSubscription?.remove();
		this._onDeviceDisconnectedSubscription = null;
		// this._favoriteDevice.set(null);
		// this._favoriteDeviceSNU.set(null);
		// await this.favoriteDeviceStorage.clear();
		this._currentRingBattery.set(null);
		this._batteryListenerUnsubscribe?.();
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
					this._currentRingLiveData.update((c) => {
						const maxHeartRate =
							c.data && !isNaN(Math.max(deserializedData.heartRate, c.data.heartRate ?? deserializedData.heartRate))
								? Math.max(deserializedData.heartRate, c.data.maxHeartRate ?? deserializedData.heartRate)
								: deserializedData.heartRate;

						if (deserializedData.heartRate === 0) {
							return { ...c, data: { ...c.data, correlation: 0 } };
						}

						return { ...c, data: { ...deserializedData, maxHeartRate, correlation: 1 } };
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
