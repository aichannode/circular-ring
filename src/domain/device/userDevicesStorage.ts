import { Storage } from "@core/storage";
import { NamedDevice } from "./namedDevice";

const userDevicesStorageKey = "@userdevices";

export class UserDevicesStorage {
	save(devices: NamedDevice[]) {
		return Storage.save<NamedDevice[]>(userDevicesStorageKey, devices);
	}

	load() {
		return Storage.load<NamedDevice[]>(userDevicesStorageKey);
	}

	clear() {
		return Storage.remove(userDevicesStorageKey);
	}
}
