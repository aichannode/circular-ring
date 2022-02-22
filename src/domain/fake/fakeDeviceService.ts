import { Observable, observable } from "micro-observables";

export interface FakeDeviceService {
	fakeDeviceEnabled: Observable<boolean>;
	toggleFakeDevice: () => void;
}
export class DevFakeDeviceService implements FakeDeviceService {
	private _fakeDeviceEnabled = observable(false);
	readonly fakeDeviceEnabled = this._fakeDeviceEnabled.readOnly();

	toggleFakeDevice() {
		this._fakeDeviceEnabled.update((c) => !c);
	}
}

export class EmptyFakeDeviceService implements FakeDeviceService {
	readonly fakeDeviceEnabled = observable(false).readOnly();

	toggleFakeDevice() {
		// EMPTY
	}
}
