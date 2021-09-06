import { delay } from "@core/utils";
import { observable } from "micro-observables";
import { PermissionsAndroid, Platform } from "react-native";
import { BleManager, State } from "react-native-ble-plx";

const enableBluetoothTimeout = 5000;

export class BluetoothService {
	private _state = observable<State>(State.Unknown);
	manager: BleManager = new BleManager();

	readonly state = this._state.readOnly();
	readonly enabled = this._state.select((state) => state === State.PoweredOn);
	readonly ready = this._state.select((state) => state !== State.Unknown && state !== State.Resetting);

	async init() {
		this._state.set(await this.manager.state());
		this.manager.onStateChange((state) => this._state.set(state));
	}

	async enable() {
		if (!this.ready.get()) {
			await new Promise((resolve) => {
				this.ready.subscribe(resolve);
			});
		}
		if (Platform.OS === "ios") {
			if (!this.enabled.get()) {
				this.log("Bluetooth not enabled");
				throw Error("CannotEnableBluetoothOnIOS");
			}
		} else {
			if ("granted" !== (await PermissionsAndroid.request("android.permission.ACCESS_FINE_LOCATION"))) {
				this.log("Unauthorized");
				throw Error("Unauthorized");
			}
			if (!this.enabled.get()) {
				this.log("Enabling Bluetooth");
				const enablePromise = new Promise((resolve) => this.enabled.subscribe(resolve));
				const timeoutPromise = delay(enableBluetoothTimeout).then(() => {
					throw Error("Timeout");
				});
				this.manager.enable();
				await Promise.race([enablePromise, timeoutPromise]);
			}
		}
		this.log("ENABLED");
	}

	log(...args: unknown[]) {
		console.log("📶 [BLE]", ...args);
	}
}
