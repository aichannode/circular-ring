import { getLogger } from "@core/logger/logger";
import { delay, observableToPromise } from "@core/utils";
import { observable } from "micro-observables";
import { PermissionsAndroid, Platform } from "react-native";
import { BleManager, State } from "react-native-ble-plx";

const enableBluetoothTimeout = 5000;

export class BluetoothService {
	private logger = getLogger("📶 BluetoothService");

	private _state = observable<State>(State.Unknown);
	manager: BleManager = new BleManager();

	readonly state = this._state.readOnly();
	readonly enabled = this._state.select((state) => state === State.PoweredOn);
	readonly ready = this._state.select((state) => state !== State.Unknown && state !== State.Resetting);

	constructor() {
		this.manager.onStateChange((state) => this._state.set(state));
	}

	async init() {
		this._state.set(await this.manager.state());
	}

	async enable() {
		if (!this.ready.get()) {
			await new Promise((resolve) => {
				this.ready.subscribe(resolve);
			});
		}
		if (Platform.OS === "ios") {
			if (!this.enabled.get()) {
				this.logger.warn("Bluetooth not enabled on iOS, waiting... for activation");
				await observableToPromise(this.enabled);
			}
		} else {
			if ("granted" !== (await PermissionsAndroid.request("android.permission.ACCESS_FINE_LOCATION"))) {
				this.logger.warn("Unauthorized");
				throw Error("Unauthorized");
			}
			if (!this.enabled.get()) {
				this.logger.debug("Enabling Bluetooth");
				const enablePromise = new Promise((resolve) => this.enabled.subscribe(resolve));
				const timeoutPromise = delay(enableBluetoothTimeout).then(() => {
					throw Error("Timeout");
				});
				this.manager.enable();
				await Promise.race([enablePromise, timeoutPromise]);
			}
		}
		this.logger.debug("ENABLED");
	}
}
