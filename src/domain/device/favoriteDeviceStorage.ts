import { Storage } from "@core/storage";
import { NamedDevice } from "./namedDevice";

const favoriteDeviceStorageKey = "@favoriteDevice";

export class FavoriteDeviceStorage {
	save(devices: NamedDevice[]) {
		return Storage.save<NamedDevice[]>(favoriteDeviceStorageKey, devices);
	}

	load() {
		return Storage.load<NamedDevice[]>(favoriteDeviceStorageKey);
	}

	clear() {
		return Storage.remove(favoriteDeviceStorageKey);
	}
}
